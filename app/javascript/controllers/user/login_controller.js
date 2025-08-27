import { Controller } from "@hotwired/stimulus"
import CryptoHelper from "../../helpers/crypto_helper"

// Connects to data-controller="user--login"
export default class extends Controller {
  connect() {
  }

  submit(event) { 
    event.preventDefault();
    const form = event.target;

    fetch(form.action, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: new FormData(form)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          let userKey = data.user_key;
          if (userKey) {
            this.decodeAndStoreKey(userKey, form);
          }
        }
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
        }
      })
      .catch((error) => {
        // Error occured
      });
  }

  async decodeAndStoreKey(userKey, form) {
    const pass = form.querySelector("#user_password").value;
    const pKey = await CryptoHelper.decryptPrivateKey(userKey, pass);
    if (pKey) {
      const sessionHashKey = await CryptoHelper.createSessionHashKey();
      const encryptSessionPKey = await CryptoHelper.sessionEncryptPrivateKey(pKey, sessionHashKey);
      window.localStorage["pkey"] = JSON.stringify(encryptSessionPKey);
    }
  }
}
