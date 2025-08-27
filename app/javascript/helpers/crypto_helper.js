import * as openpgp from "openpgp";

export default class CryptoHelper {
  static async generateKeys(username, email) {
    try {
      const { privateKey, publicKey } = await openpgp.generateKey({
        type: 'ecc',
        curve: 'curve25519',
        userIDs: [{ username: username, email: email }],
      });
      return { publicKey, privateKey };
    } catch (error) {
      //console.error("Error generating keys:", error);
      return null;
    }
  }

  static async encryptPrivateKey(privateKeyArmored, password) {
    try {
      const privateKeyObject = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
      const encryptedKey = await openpgp.encryptKey({
        privateKey: privateKeyObject,
        passphrase: password
      });
      return encryptedKey.armor();
    } catch (error) {
      //console.error("Error encrypting private key:", error);
      return null;
    }
  }

  static async decryptPrivateKey(encryptedPrivateKeyArmored, password) {
    try {
      const encryptedKeyObject = await openpgp.readPrivateKey({ armoredKey: encryptedPrivateKeyArmored });
      const decryptedKeyObject = await openpgp.decryptKey({
        privateKey: encryptedKeyObject,
        passphrase: password
      });
      return decryptedKeyObject.armor();
    } catch (error) {
      //console.error("Error decrypting private key (check password):", error);
      return null;
    }
  }

  static async encryptMessage(recipientPublicKeysArmored, plainText) {
    try {
      const recipientPublicKeys = await Promise.all(
        recipientPublicKeysArmored.map(armoredKey => openpgp.readKey({ armoredKey }))
      );

      const message = await openpgp.createMessage({ text: plainText });

      const encryptedMessage = await openpgp.encrypt({
        message,
        encryptionKeys: recipientPublicKeys,
      });
      return encryptedMessage;
    } catch (error) {
      //console.error("Error encrypting message:", error);
      return null;
    }
  }

  static async decryptMessage(privateKeyArmored, encryptedMessageArmored) {
    try {
      const message = await openpgp.readMessage({ armoredMessage: encryptedMessageArmored });
      const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
      const { data: decryptedText } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
      });
      return decryptedText;
    } catch (error) {
      //console.error("Error decrypting message:", error);
      return null;
    }
  }

  static async encryptFile(recipientPublicKeysArmored, fileData) {
    try {
      const recipientPublicKeys = await Promise.all(
        recipientPublicKeysArmored.map(armoredKey => openpgp.readKey({ armoredKey }))
      );

      const message = await openpgp.createMessage({ binary: fileData });

      const encryptedFile = await openpgp.encrypt({
        message,
        encryptionKeys: recipientPublicKeys,
        format: 'binary' // Specify binary output
      });

      return encryptedFile;
    } catch (error) {
      console.error("Error encrypting file:", error);
      return null;
    }
  }

  static async decryptFile(encryptedPrivateKeyArmored, encryptedFileData) {
    try {
      const privateKey = await openpgp.readPrivateKey({ armoredKey: encryptedPrivateKeyArmored });

      const message = await openpgp.readMessage({ binaryMessage: encryptedFileData });

      const { data: decryptedFile } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey,
        format: 'binary' // Specify binary input
      });

      return decryptedFile;
    } catch (error) {
      console.error("Error decrypting file:", error);
      return null;
    }
  }

  static async sessionEncryptPrivateKey(privateKey, sessionKey) {
    const cryptoKey = await this.getCryptoKey(sessionKey);
    // Encode privateKey as Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(privateKey);
    // Generate random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    // Encrypt
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );

    return {
      iv: btoa(String.fromCharCode(...iv)),
      encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    };
  }

  static async sessionDecryptPrivateKey(encryptedObj, sessionKey) {
    const cryptoKey = await this.getCryptoKey(sessionKey);

    // Decode IV and encrypted data from base64
    const iv = Uint8Array.from(atob(encryptedObj.iv), c => c.charCodeAt(0));
    const encryptedData = Uint8Array.from(atob(encryptedObj.encrypted), c => c.charCodeAt(0));
    // Decrypt
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encryptedData
    );
    // Decode to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  static generateRescueKey(length = 16) {
    const array = new Uint8Array(length / 2); // 2 hex chars per byte
    window.crypto.getRandomValues(array);
    return (Array.from(array, b => b.toString(16).padStart(2, '0')).join('')).toUpperCase();
  }

  static async getCryptoKey(sessionKey) {
    // Convert sessionKey hex to Uint8Array
    const keyBytes = new Uint8Array(sessionKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    // Import sessionKey as CryptoKey
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    return cryptoKey;
  }

  static async createSessionHashKey() {
    // Generate random bytes for the session key
    const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
    // Hash the random bytes using SHA-256
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', randomBytes);
    // Convert hash buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    this.storeSessionHashKey(hashHex);
    return hashHex;
  }

  static fetchSessionHashKey() {
    const sessionHashKey = window.sessionStorage.getItem('sessionHashKey');
    return sessionHashKey;
  }

  static storeSessionHashKey(sessionHashKey) {
    window.sessionStorage.setItem('sessionHashKey', sessionHashKey);
  }

  static clearSessionHashKey() {
    window.sessionStorage.removeItem('sessionHashKey');
  }
}