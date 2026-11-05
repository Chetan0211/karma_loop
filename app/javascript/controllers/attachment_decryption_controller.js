import { Controller } from "@hotwired/stimulus"
import CryptoHelper from "helpers/crypto_helper"
import KeyManager from "key_manager"
import AttachmentStream from "helpers/attachment_stream_helper"

// Object URLs of decrypted attachments, shared so reply previews don't download and decrypt the same file again
const decryptedUrls = new Map();

// Connects to data-controller="attachment-decryption"
export default class extends Controller {
  static targets = ["attachment"]
  static values = { manifest: String }

  async connect() {
    if (!KeyManager.getPrivateKey()) {
      KeyManager.initialize();
    }
    this.privateKey = await KeyManager.getPrivateKey();
    if (!this.privateKey) {
      KeyManager.logoutUser();
      return;
    }

    const manifest = await CryptoHelper.decryptMessage(this.privateKey, JSON.parse(this.manifestValue));
    if (!manifest) {
      this.attachmentTargets.forEach(element => this.showUnavailable(element));
      return;
    }
    this.metadata = new Map(JSON.parse(manifest).map(entry => [entry.id, entry]));
    this.attachmentTargets.forEach(element => this.render(element));
  }

  render(element) {
    const metadata = this.metadata.get(element.dataset.attachmentId);
    if (!metadata) {
      this.showUnavailable(element);
      return;
    }

    this.role(element, "name").textContent = metadata.name;
    this.role(element, "size").textContent = this.formatSize(metadata.size);
    this.role(element, "lock-icon").classList.add("hidden");

    // Only accept an inline JPEG, so a crafted manifest can't make viewers load a tracking URL
    const hasThumbnail = typeof metadata.thumbnail == "string" && metadata.thumbnail.startsWith("data:image/jpeg;base64,");
    if (hasThumbnail && (metadata.type.startsWith("image/") || metadata.type.startsWith("video/"))) {
      const thumbnail = this.role(element, "thumbnail");
      thumbnail.src = metadata.thumbnail;
      thumbnail.classList.remove("hidden");
      if (metadata.type.startsWith("video/")) {
        this.role(element, "play-icon").classList.remove("hidden");
      }
    }
    else if (metadata.type.startsWith("image/")) {
      this.role(element, "image-icon").classList.remove("hidden");
      // Images are small enough to decrypt up front for the thumbnail
      this.decrypt(element, metadata).then(url => {
        const thumbnail = this.role(element, "thumbnail");
        thumbnail.src = url;
        thumbnail.classList.remove("hidden");
        this.role(element, "image-icon").classList.add("hidden");
      }).catch(() => {});
    }
    else if (metadata.type.startsWith("video/")) {
      this.role(element, "video-icon").classList.remove("hidden");
    }
    else {
      this.role(element, "file-icon").classList.remove("hidden");
    }
  }

  async open(event) {
    const element = event.currentTarget;
    const metadata = this.metadata?.get(element.dataset.attachmentId);
    if (!metadata) return;

    // Videos stream through the service worker, so they play and seek without downloading the whole file first
    if (metadata.type.startsWith("video/")) {
      const streamUrl = AttachmentStream.url(metadata, element.dataset.url);
      if (streamUrl) {
        this.showAttachment(element, metadata, streamUrl);
        return;
      }
    }

    // Documents the viewer can't show open with just a download button
    if (!this.previewable(metadata)) {
      this.showAttachment(element, metadata, null);
      return;
    }

    const url = await this.decryptWithStatus(element, metadata);
    if (url) this.showAttachment(element, metadata, url);
  }

  // The type comes from the sender, so only frame real PDFs; anything else (an HTML file, say)
  // would run inside our origin if it were shown from a blob: URL.
  previewable(metadata) {
    return metadata.type.startsWith("image/") || metadata.type.startsWith("video/") || metadata.type === "application/pdf";
  }

  showAttachment(element, metadata, url) {
    const data = {
      type: metadata.type,
      url: url,
      name: metadata.name,
      download: () => this.download(element, metadata)
    };
    let show_attachment = document.querySelector("#show_attachment");
    show_attachment.dispatchEvent(new CustomEvent('set-show-attachment-data', { detail: { data: data, showMenu: true } }))
  }

  async download(element, metadata) {
    const url = await this.decryptWithStatus(element, metadata);
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = metadata.name;
    link.click();
  }

  // Download button on an attachment card; stop the click from also opening the viewer
  downloadOne(event) {
    event.stopPropagation();
    const element = event.currentTarget.closest('[data-attachment-decryption-target="attachment"]');
    const metadata = this.metadata?.get(element.dataset.attachmentId);
    if (metadata) this.download(element, metadata);
  }

  // One file at a time; the browser may ask once for permission to download several files
  async downloadAll() {
    for (const element of this.attachmentTargets) {
      const metadata = this.metadata?.get(element.dataset.attachmentId);
      if (metadata) await this.download(element, metadata);
    }
  }

  async decryptWithStatus(element, metadata) {
    const name = this.role(element, "name");
    name.textContent = "decrypting...";
    try {
      const url = await this.decrypt(element, metadata);
      name.textContent = metadata.name;
      return url;
    } catch (error) {
      console.error("Error decrypting attachment");
      name.textContent = "Unable to decrypt attachment";
      return null;
    }
  }

  decrypt(element, metadata) {
    if (!decryptedUrls.has(metadata.id)) {
      const decrypted = fetch(element.dataset.url)
        .then(response => {
          if (!response.ok) throw new Error(`Attachment download failed: ${response.status}`);
          return CryptoHelper.decryptAttachment(response, metadata);
        })
        .then(blob => URL.createObjectURL(blob));
      // Allow a retry on the next click if this attempt fails
      decrypted.catch(() => decryptedUrls.delete(metadata.id));
      decryptedUrls.set(metadata.id, decrypted);
    }
    return decryptedUrls.get(metadata.id);
  }

  showUnavailable(element) {
    this.role(element, "name").textContent = "Unable to decrypt attachment";
  }

  role(element, name) {
    return element.querySelector(`[data-role="${name}"]`);
  }

  formatSize(bytes) {
    const units = ["Bytes", "KB", "MB", "GB"];
    let size = bytes;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
      size /= 1024;
      unit++;
    }
    return unit == 0 ? `${size} Bytes` : `${size.toFixed(1)} ${units[unit]}`;
  }
}
