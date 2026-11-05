// Streams end-to-end encrypted chat videos to <video> elements. Only the byte ranges the player asks
// for are downloaded and decrypted, so playback starts quickly and seeking works without fetching the
// whole file. The chunk format is defined in app/javascript/helpers/crypto_helper.js; keep the two in sync.
// Keys are never stored here: every request asks the page that is playing the video for them.

const STREAM_PATH = "/encrypted_attachments/";
const TAG_SIZE = 16;
const LOOKUP_TIMEOUT = 3000;

// Signed storage URLs the Rails blob redirect resolved to, so seeking doesn't go through Rails every time
const resolvedUrls = new Map();

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin != self.location.origin || !url.pathname.startsWith(STREAM_PATH)) return;

  const id = decodeURIComponent(url.pathname.slice(STREAM_PATH.length));
  event.respondWith(streamAttachment(event, id).catch(() => new Response(null, { status: 502 })));
});

async function streamAttachment(event, id) {
  const stream = await lookup(event.clientId, id);
  if (!stream) return new Response(null, { status: 404 });

  const { metadata, sourceUrl } = stream;
  if (metadata.size == 0) {
    return new Response(null, { status: 200, headers: { "Content-Type": metadata.type, "Content-Length": "0" } });
  }
  const range = parseRange(event.request.headers.get("Range"), metadata.size);
  if (!range) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${metadata.size}` } });
  }

  const chunkSize = metadata.chunkSize;
  const encryptedChunkSize = chunkSize + TAG_SIZE;
  const chunkCount = Math.max(1, Math.ceil(metadata.size / chunkSize));
  const firstChunk = Math.floor(range.start / chunkSize);
  const lastChunk = Math.floor(range.end / chunkSize);
  const encryptedSize = metadata.size + chunkCount * TAG_SIZE;
  const encryptedEnd = Math.min((lastChunk + 1) * encryptedChunkSize, encryptedSize) - 1;

  const response = await fetchEncrypted(id, sourceUrl, `bytes=${firstChunk * encryptedChunkSize}-${encryptedEnd}`);
  const keyBytes = Uint8Array.from(atob(metadata.key), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]);
  const reader = chunkReader(response.body, encryptedChunkSize);
  if (response.status == 200) {
    // Storage ignored the range and sent the whole file, so skip to the first chunk we need
    for (let index = 0; index < firstChunk; index++) await reader.read();
  }

  let index = firstChunk;
  const body = new ReadableStream({
    async pull(controller) {
      try {
        if (index > lastChunk) {
          controller.close();
          reader.cancel();
          return;
        }
        const chunk = await reader.read();
        if (!chunk) throw new Error("Attachment is truncated");
        const decrypted = new Uint8Array(await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: chunkNonce(index, index == chunkCount - 1) },
          key,
          chunk
        ));
        // Trim the first and last chunks to the exact range the player asked for
        const chunkStart = index * chunkSize;
        controller.enqueue(decrypted.subarray(
          Math.max(0, range.start - chunkStart),
          Math.min(decrypted.length, range.end - chunkStart + 1)
        ));
        index++;
      } catch (error) {
        controller.error(error);
        reader.cancel();
      }
    },
    cancel() {
      reader.cancel();
    }
  });

  const headers = {
    "Content-Type": metadata.type,
    "Content-Length": String(range.end - range.start + 1),
    "Accept-Ranges": "bytes"
  };
  if (range.partial) {
    headers["Content-Range"] = `bytes ${range.start}-${range.end}/${metadata.size}`;
  }
  return new Response(body, { status: range.partial ? 206 : 200, headers: headers });
}

// Asks the page that requested the video for the attachment's key and storage URL
async function lookup(clientId, id) {
  const client = clientId ? await self.clients.get(clientId) : null;
  const candidates = client ? [client] : await self.clients.matchAll({ type: "window" });
  for (const candidate of candidates) {
    const stream = await ask(candidate, id);
    if (stream) return stream;
  }
  return null;
}

function ask(client, id) {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const finish = (stream) => {
      clearTimeout(timeout);
      channel.port1.close();
      resolve(stream);
    };
    const timeout = setTimeout(() => finish(null), LOOKUP_TIMEOUT);
    channel.port1.onmessage = (event) => finish(event.data);
    client.postMessage({ type: "attachment-stream:lookup", id: id }, [channel.port2]);
  });
}

async function fetchEncrypted(id, sourceUrl, range) {
  const resolvedUrl = resolvedUrls.get(id);
  if (resolvedUrl) {
    const response = await fetch(resolvedUrl, { headers: { Range: range } });
    if (response.ok) return response;
    // The signed URL has most likely expired; get a fresh one from Rails
    resolvedUrls.delete(id);
  }

  const response = await fetch(sourceUrl, { headers: { Range: range } });
  if (!response.ok) throw new Error(`Attachment download failed: ${response.status}`);
  if (response.redirected) resolvedUrls.set(id, response.url);
  return response;
}

// Supports the single ranges media players send: "bytes=start-", "bytes=start-end" and "bytes=-suffix"
function parseRange(header, size) {
  if (!header) return { start: 0, end: size - 1, partial: false };

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || (match[1] == "" && match[2] == "")) return null;

  let start;
  let end;
  if (match[1] == "") {
    start = Math.max(0, size - Number(match[2]));
    end = size - 1;
  }
  else {
    start = Number(match[1]);
    end = match[2] == "" ? size - 1 : Math.min(Number(match[2]), size - 1);
  }
  if (start > end || start >= size) return null;
  return { start: start, end: end, partial: true };
}

// Same as CryptoHelper.attachmentChunkNonce
function chunkNonce(index, last) {
  const nonce = new Uint8Array(12);
  new DataView(nonce.buffer).setUint32(7, index);
  nonce[11] = last ? 1 : 0;
  return nonce;
}

// Same as CryptoHelper.attachmentChunkReader
function chunkReader(stream, size) {
  const reader = stream.getReader();
  const buffered = [];
  let bufferedLength = 0;
  let done = false;

  return {
    async read() {
      while (bufferedLength < size && !done) {
        const result = await reader.read();
        if (result.done) {
          done = true;
        }
        else {
          buffered.push(result.value);
          bufferedLength += result.value.length;
        }
      }
      if (bufferedLength == 0) return null;

      const chunk = new Uint8Array(Math.min(size, bufferedLength));
      let offset = 0;
      while (offset < chunk.length) {
        const part = buffered[0];
        const take = Math.min(part.length, chunk.length - offset);
        chunk.set(part.subarray(0, take), offset);
        offset += take;
        if (take == part.length) {
          buffered.shift();
        }
        else {
          buffered[0] = part.subarray(take);
        }
      }
      bufferedLength -= chunk.length;
      return chunk;
    },
    cancel() {
      return reader.cancel().catch(() => {});
    }
  };
}
