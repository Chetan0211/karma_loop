import { Controller } from "@hotwired/stimulus"
import CryptoHelper from "../helpers/crypto_helper"
import KeyManager from "../key_manager"

// Connects to data-controller="message-decryption"
export default class extends Controller { 
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
      this.element.textContent = decrypted_message;
    } catch (error) {
      console.error("Error decrypting");
    }
  }

  sanitize(str) {
    return str
      .replace(/^"|"$/g, '')      // Remove leading/trailing literal quotes
      .replace(/\\n/g, '\n')      // Convert literal backslash+n to real newlines
      .trim()
  }
}