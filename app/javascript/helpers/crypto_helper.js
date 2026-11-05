import * as openpgp from "openpgp";

export default class CryptoHelper {
  static async generateKeys(username, email) {
    try {
      const { privateKey, publicKey } = await openpgp.generateKey({
        type: 'ecc',
        curve: 'curve25519',
        userIDs: [{ username: username, email: email }],
      });
      return { publicKey, privateKey };
    } catch (error) {
      //console.error("Error generating keys:", error);
      return null;
    }
  }

  static async encryptPrivateKey(privateKeyArmored, password) {
    try {
      const privateKeyObject = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
      const encryptedKey = await openpgp.encryptKey({
        privateKey: privateKeyObject,
        passphrase: password
      });
      return encryptedKey.armor();
    } catch (error) {
      //console.error("Error encrypting private key:", error);
      return null;
    }
  }

  static async decryptPrivateKey(encryptedPrivateKeyArmored, password) {
    try {
      const encryptedKeyObject = await openpgp.readPrivateKey({ armoredKey: encryptedPrivateKeyArmored });
      const decryptedKeyObject = await openpgp.decryptKey({
        privateKey: encryptedKeyObject,
        passphrase: password
      });
      return decryptedKeyObject.armor();
    } catch (error) {
      //console.error("Error decrypting private key (check password):", error);
      return null;
    }
  }

  static async encryptMessage(recipientPublicKeysArmored, plainText) {
    try {
      const recipientPublicKeys = await Promise.all(
        recipientPublicKeysArmored.map(armoredKey => openpgp.readKey({ armoredKey }))
      );

      const message = await openpgp.createMessage({ text: plainText });

      const encryptedMessage = await openpgp.encrypt({
        message,
        encryptionKeys: recipientPublicKeys,
      });
      return encryptedMessage;
    } catch (error) {
      //console.error("Error encrypting message:", error);
      return null;
    }
  }

  static async decryptMessage(privateKeyArmored, encryptedMessageArmored) {
    try {
      const message = await openpgp.readMessage({ armoredMessage: encryptedMessageArmored });
      const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
      const { data: decryptedText } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
      });
      return decryptedText;
    } catch (error) {
      //console.error("Error decrypting message:", error);
      return null;
    }
  }

  static async encryptFile(recipientPublicKeysArmored, fileData) {
    try {
      const recipientPublicKeys = await Promise.all(
        recipientPublicKeysArmored.map(armoredKey => openpgp.readKey({ armoredKey }))
      );

      const message = await openpgp.createMessage({ binary: fileData });

      const encryptedFile = await openpgp.encrypt({
        message,
        encryptionKeys: recipientPublicKeys,
        format: 'binary' // Specify binary output
      });

      return encryptedFile;
    } catch (error) {
      //console.error("Error encrypting file:", error);
      return null;
    }
  }

  static async decryptFile(encryptedPrivateKeyArmored, encryptedFileData) {
    try {
      const privateKey = await openpgp.readPrivateKey({ armoredKey: encryptedPrivateKeyArmored });

      const message = await openpgp.readMessage({ binaryMessage: encryptedFileData });

      const { data: decryptedFile } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey,
        format: 'binary' // Specify binary input
      });

      return decryptedFile;
    } catch (error) {
      //console.error("Error decrypting file:", error);
      return null;
    }
  }

  // Chat attachments are encrypted in fixed-size chunks so they can be streamed, and videos can be
  // decrypted by byte range for seeking. Every chunk is AES-GCM with the file's own key and a nonce of
  // the chunk index plus a final-chunk flag, so chunks can't be reordered, swapped or truncated.
  // public/attachment_service_worker.js decrypts the same format; keep the two in sync.
  static ATTACHMENT_CHUNK_SIZE = 1024 * 1024;
  static ATTACHMENT_TAG_SIZE = 16;

  // The returned file is what gets uploaded; its random name is the only link between
  // the stored blob and its entry in the encrypted manifest.
  static async encryptAttachment(file) {
    const key = await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    const chunkSize = this.ATTACHMENT_CHUNK_SIZE;
    const chunkCount = this.attachmentChunkCount(file.size, chunkSize);
    // Grow a Blob one chunk at a time so the browser can keep it on disk instead of holding the whole file in memory
    let encrypted = new Blob([]);
    for (let index = 0; index < chunkCount; index++) {
      const chunk = await file.slice(index * chunkSize, (index + 1) * chunkSize).arrayBuffer();
      const encryptedChunk = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: this.attachmentChunkNonce(index, index == chunkCount - 1) },
        key,
        chunk
      );
      encrypted = new Blob([encrypted, encryptedChunk]);
    }
    const rawKey = new Uint8Array(await window.crypto.subtle.exportKey('raw', key));
    const id = `${window.crypto.randomUUID()}.enc`;

    return {
      file: new File([encrypted], id, { type: 'application/octet-stream' }),
      metadata: {
        version: 1,
        id: id,
        name: file.name,
        type: file.type,
        size: file.size,
        chunkSize: chunkSize,
        key: btoa(String.fromCharCode(...rawKey))
      }
    };
  }

  // Decrypts a downloaded attachment chunk by chunk as it arrives, so only one chunk is in memory at a time
  static async decryptAttachment(response, metadata) {
    const keyBytes = Uint8Array.from(atob(metadata.key), c => c.charCodeAt(0));
    const key = await window.crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['decrypt']);
    const chunkCount = this.attachmentChunkCount(metadata.size, metadata.chunkSize);
    const reader = this.attachmentChunkReader(response.body, metadata.chunkSize + this.ATTACHMENT_TAG_SIZE);

    let decrypted = new Blob([], { type: metadata.type });
    for (let index = 0; index < chunkCount; index++) {
      const chunk = await reader.read();
      if (!chunk) throw new Error("Attachment is truncated");
      const decryptedChunk = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: this.attachmentChunkNonce(index, index == chunkCount - 1) },
        key,
        chunk
      );
      decrypted = new Blob([decrypted, decryptedChunk], { type: metadata.type });
    }
    if (await reader.read()) throw new Error("Attachment has unexpected trailing data");
    return decrypted;
  }

  static attachmentChunkCount(size, chunkSize) {
    return Math.max(1, Math.ceil(size / chunkSize));
  }

  // 12-byte nonce: big-endian chunk index, then 1 on the final chunk and 0 otherwise
  static attachmentChunkNonce(index, last) {
    const nonce = new Uint8Array(12);
    new DataView(nonce.buffer).setUint32(7, index);
    nonce[11] = last ? 1 : 0;
    return nonce;
  }

  // Reads a byte stream in pieces of exactly `size` bytes; only the final piece may be shorter
  static attachmentChunkReader(stream, size) {
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
        return reader.cancel();
      }
    };
  }

  static async sessionEncryptPrivateKey(privateKey, sessionKey) {
    const cryptoKey = await this.getCryptoKey(sessionKey);
    // Encode privateKey as Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(privateKey);
    // Generate random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    // Encrypt
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );

    return {
      iv: btoa(String.fromCharCode(...iv)),
      encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    };
  }

  static async sessionDecryptPrivateKey(encryptedObj, sessionKey) {
    const cryptoKey = await this.getCryptoKey(sessionKey);

    // Decode IV and encrypted data from base64
    const iv = Uint8Array.from(atob(encryptedObj.iv), c => c.charCodeAt(0));
    const encryptedData = Uint8Array.from(atob(encryptedObj.encrypted), c => c.charCodeAt(0));
    // Decrypt
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encryptedData
    );
    // Decode to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  static generateRescueKey(length = 16) {
    const array = new Uint8Array(length / 2); // 2 hex chars per byte
    window.crypto.getRandomValues(array);
    return (Array.from(array, b => b.toString(16).padStart(2, '0')).join('')).toUpperCase();
  }

  static async getCryptoKey(sessionKey) {
    // Convert sessionKey hex to Uint8Array
    const keyBytes = new Uint8Array(sessionKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    // Import sessionKey as CryptoKey
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
    return cryptoKey;
  }

  static async createSessionHashKey() {
    // Generate random bytes for the session key
    const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
    // Hash the random bytes using SHA-256
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', randomBytes);
    // Convert hash buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    this.storeSessionHashKey(hashHex);
    return hashHex;
  }

  static fetchSessionHashKey() {
    return window.sessionStorage.getItem('sessionHashKey');
  }

  static storeSessionHashKey(sessionHashKey) {
    window.sessionStorage.setItem('sessionHashKey', sessionHashKey);
  }

  static clearSessionHashKey() {
    window.sessionStorage.removeItem('sessionHashKey');
  }

  static fetchEncryptedPrivateKey() {
    return window.localStorage["pkey"];
  }

  static setEncryptedPrivateKey(encryptedPrivateKey) {
    window.localStorage["pkey"] = encryptedPrivateKey;
  }
}