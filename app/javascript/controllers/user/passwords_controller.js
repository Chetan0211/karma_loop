import { Controller } from "@hotwired/stimulus"
import CryptoHelper from "../../helpers/crypto_helper"

// Connects to data-controller="user--passwords"
export default class extends Controller {
  connect() {
  }

  async submit(event) {
    event.preventDefault();
    const form = event.target;
    const password = form.querySelector("#user_password").value;
    let publicKey = form.querySelector("#user_public_key").value;
    let encryptedKey = JSON.parse(form.querySelector("#user_encrypted_key").value);
    const username = this.data.get("username");
    const email = this.data.get("email");
    const secureKey = form.querySelector("#secureKeyInput").value.replaceAll('-', '');
    const skipKeyCheckbox = form.querySelector("#skipKeyCheckbox").checked;
    let privateKey;
    
    if(skipKeyCheckbox) {
      const keys = await CryptoHelper.generateKeys(username, email);
      publicKey = keys.publicKey;
      privateKey = keys.privateKey;
    }
    else {
      privateKey = await CryptoHelper.decryptPrivateKey(encryptedKey.rescuePKey, secureKey);
      if (!privateKey) {
        // TODO: This needs to show error to user - Invalid secure key
        return;
      }
    }
    
    const newPasswordEncryptedPrivateKey = await CryptoHelper.encryptPrivateKey(privateKey, password);

    const rescueKey = skipKeyCheckbox ? CryptoHelper.generateRescueKey() : secureKey;
    const newRescueEncryptedPrivateKey = await CryptoHelper.encryptPrivateKey(privateKey, rescueKey);
    const encryptedPKey = JSON.stringify({
      passwordPKey: newPasswordEncryptedPrivateKey,
      rescuePKey: newRescueEncryptedPrivateKey
    });

    form.querySelector("#user_public_key").value = publicKey;
    form.querySelector("#user_encrypted_key").value = encryptedPKey;

    let url = new URL(form.action);
    url.searchParams.append('skip_secure_key', skipKeyCheckbox);
    fetch(url.href, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: new FormData(form)
    })
    .then(response => {
      return response.json()
    })
    .then(async data => {
      if (data.success) {
        sessionStorage.setItem("rescueKey", rescueKey);
        window.location.href = data.redirect_url;
      }
      else {
        let redirect_url = new URL(data.redirect_url);
        const currentUrl = new URL(window.location.href);
        const resetPasswordToken = currentUrl.searchParams.get('reset_password_token');
        redirect_url.searchParams.append('reset_password_token', resetPasswordToken);
        window.location.href = redirect_url.href;
      }
      
    })
    .catch((error) => {
      // Error occured
    });
  }
}
