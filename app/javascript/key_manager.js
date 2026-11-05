import CryptoHelper from "helpers/crypto_helper";

let privateKeypromise = null;
// Several controllers can detect a missing key at once; only the first one should sign out,
// otherwise later sign-outs reset the session and invalidate the sign-in page's CSRF token.
let loggingOut = false;

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
    if (loggingOut) return;
    loggingOut = true;
    fetch("/users/sign_out", {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
      }
    }).finally(() => {
      CryptoHelper.clearSessionHashKey();
      CryptoHelper.setEncryptedPrivateKey("");
      window.location.href = "/users/sign_in?reason=locked";
    });
  }
}

export default KeyManager;