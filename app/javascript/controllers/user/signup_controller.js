import { Controller } from "@hotwired/stimulus"
import CryptoHelper from "../../helpers/crypto_helper"

// Connects to data-controller="user--signup"
export default class extends Controller {
  connect() {
  }

  async submit(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.querySelector("#user_username").value;
    const email = form.querySelector("#user_email").value;
    const password = form.querySelector("#user_password").value;
    const { publicKey, passwordEncryptedPrivateKey, rescueKey, rescueEncryptedPrivateKey } = await this.createKeys(username, email, password);
    const encryptedPKey = {passwordPKey: passwordEncryptedPrivateKey, rescuePKey: rescueEncryptedPrivateKey};
    form.querySelector("#user_public_key").value = publicKey;
    form.querySelector("#user_encrypted_key").value = JSON.stringify(encryptedPKey);

    fetch(form.action, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: new FormData(form)
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.success) {
          sessionStorage.setItem("rescueKey", rescueKey);
        }
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
        }
      })
      .catch((error) => {
        console.log("An error occurred while processing the signup request:", error);
      });
  }

  async createKeys(username, email, password) {
    const { publicKey, privateKey } = await CryptoHelper.generateKeys(username, email);
    const passwordEncryptedPrivateKey = await CryptoHelper.encryptPrivateKey(privateKey, password);
    const rescueKey = CryptoHelper.generateRescueKey();
    const rescueEncryptedPrivateKey = await CryptoHelper.encryptPrivateKey(privateKey, rescueKey);


    return {publicKey, passwordEncryptedPrivateKey, rescueKey, rescueEncryptedPrivateKey};
  }
}
