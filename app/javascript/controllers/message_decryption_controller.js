import { Controller } from "@hotwired/stimulus"
import CryptoHelper from "helpers/crypto_helper"
import KeyManager from "key_manager"
import { parseMediaMessage, messagePreviewText, createMediaElement } from "helpers/media_message_helper"

// Connects to data-controller="message-decryption"
export default class extends Controller {
  // display: "full" shows GIFs and stickers, "reply" shows them small, anything else shows a text label
  static values = { display: String }

  async connect() {
    KeyManager.initialize();
    this.privateKey = await KeyManager.getPrivateKey();
    if (!this.privateKey) {
      KeyManager.logoutUser();
    }
    await this.decryptMessage();
  }

  async decryptMessage() {
    const encrypted_message = this.element.dataset.encryptedMessage;

    if (!encrypted_message) return;

    try {
      const decrypted_message = await CryptoHelper.decryptMessage(this.privateKey, this.sanitize(encrypted_message));
      this.render(decrypted_message);
    } catch (error) {
      console.error("Error decrypting");
    }
  }

  render(message) {
    const media = parseMediaMessage(message);
    if (media && this.displayValue == "full") {
      this.element.replaceChildren(createMediaElement(media));
    }
    else if (media && this.displayValue == "reply") {
      this.element.replaceChildren(createMediaElement(media, "small"));
    }
    else {
      this.element.textContent = messagePreviewText(message);
    }
  }

  sanitize(str) {
    return str
      .replace(/^"|"$/g, '')      // Remove leading/trailing literal quotes
      .replace(/\\n/g, '\n')      // Convert literal backslash+n to real newlines
      .trim()
  }
}
