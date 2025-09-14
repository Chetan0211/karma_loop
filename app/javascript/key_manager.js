import CryptoHelper from "./helpers/crypto_helper";

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
    //Logout user and redirect to login page.
  }
}

export default KeyManager;