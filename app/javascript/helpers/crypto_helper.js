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
      console.error("Error generating keys:", error);
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
      console.error("Error encrypting private key:", error);
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
      console.error("Error decrypting private key (check password):", error);
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
      console.error("Error encrypting message:", error);
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
      console.error("Error decrypting message:", error);
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
}