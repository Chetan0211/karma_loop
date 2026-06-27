import CryptoHelper from "helpers/crypto_helper";

let privateKeypromise = null;

const KeyManager = {

  initialize() {
    let encryptedPrivateKey = CryptoHelper.fetchEncryptedPrivateKey();
    let sessionHashKey = CryptoHelper.fetchSessionHashKey();
    if (encryptedPrivateKey && sessionHashKey) {
      privateKeypromise = CryptoHelper.sessionDecryptPrivateKey(JSON.parse(encryptedPrivateKey), sessionHashKey);
    }
    else {
      this.logoutUser();
    }
  },

  getPrivateKey() {
    return privateKeypromise;
  },

  logoutUser() {
    fetch("/users/sign_out", {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
      }
    }).then(() => {
      CryptoHelper.clearSessionHashKey();
      CryptoHelper.setEncryptedPrivateKey("");
      window.location.href = "/users/sign_in";
    });
  }
}

export default KeyManager;