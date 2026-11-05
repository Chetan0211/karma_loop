import { Controller } from "@hotwired/stimulus"
import CryptoHelper from "helpers/crypto_helper"

// Connects to data-controller="user--login"
export default class extends Controller {
  static targets = ["error"]

  connect() {
  }

  submit(event) {
    event.preventDefault();
    const form = event.target;
    this.hideError();

    fetch(form.action, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: new FormData(form)
    })
      .then(async response => {
        if (response.headers.get("Content-Type")?.includes("application/json")) {
          return response.json();
        }
        // A non-JSON 422 means Rails rejected the CSRF token, usually because the page is stale.
        if (response.status === 422) {
          throw new Error("Your session expired. Please refresh the page and try again.");
        }
        throw new Error(`Something went wrong (${response.status}). Please try again.`);
      })
      .then(async data => {
        if (!data.success) {
          this.showError(data.error || "Invalid email or password.");
          return;
        }
        let userKey = data.user_key;
        if (userKey) {
          let keys = JSON.parse(userKey);
          await this.decodeAndStoreKey(keys.passwordPKey, form);
        }
        if (data.redirect_url) {
          data.redirect_url = data.redirect_url.replace(/\.json$/, '');
          window.location.href = data.redirect_url;
        }
      })
      .catch((error) => {
        this.showError(error.message || "Something went wrong. Please try again.");
      });
  }

  showError(message) {
    this.errorTarget.textContent = message;
    this.errorTarget.classList.remove("hidden");
  }

  hideError() {
    this.errorTarget.classList.add("hidden");
  }

  async decodeAndStoreKey(userKey, form) {
    const pass = form.querySelector("#user_password").value;
    const pKey = await CryptoHelper.decryptPrivateKey(userKey, pass);
    if (pKey) {
      const sessionHashKey = await CryptoHelper.createSessionHashKey();
      const encryptSessionPKey = await CryptoHelper.sessionEncryptPrivateKey(pKey, sessionHashKey);
      CryptoHelper.setEncryptedPrivateKey(JSON.stringify(encryptSessionPKey));
    }
  }
}
