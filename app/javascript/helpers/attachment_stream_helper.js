// Page side of public/attachment_service_worker.js, which streams encrypted videos with seeking.
// Keys stay in this page's memory; the worker asks for them on every request and never stores them.
const streams = new Map();

const AttachmentStream = {
  start() {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/attachment_service_worker.js", { scope: "/" }).catch(() => {});
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type != "attachment-stream:lookup") return;
      event.ports[0].postMessage(streams.get(event.data.id) || null);
    });
    navigator.serviceWorker.startMessages();
  },

  // Returns a URL a <video> element can play and seek, or null when the worker isn't controlling
  // this page (first visit before it activates, a hard reload, or no service worker support)
  url(metadata, sourceUrl) {
    if (!navigator.serviceWorker?.controller) return null;

    streams.set(metadata.id, { metadata: metadata, sourceUrl: new URL(sourceUrl, window.location.href).href });
    return `/encrypted_attachments/${encodeURIComponent(metadata.id)}`;
  }
};

export default AttachmentStream;
