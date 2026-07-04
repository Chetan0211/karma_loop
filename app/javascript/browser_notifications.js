import CryptoHelper from "helpers/crypto_helper"
import KeyManager from "key_manager"

export function check_notification_access() {
  if (Notification.permission !== "granted" || Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

export async function show_notification(data) {
  if (Notification.permission === "granted") {
    let body = data.body;
    if (data.is_chat) {
      body = await decrypt_message(data.body);
    }
    const notification = new Notification(data.title, {
      body: body,
      icon: '/assets/logo.png'
    });
    const soundPath = document.body.dataset.notificationSoundPath;
    if (soundPath) {
      const audio = new Audio(soundPath);
      audio.play();
    }

    notification.onclick = function() {
      window.focus();
      notification.close();
    };
  }
}

async function decrypt_message(encrypted_message) { 
  KeyManager.initialize();
  let privateKey = await KeyManager.getPrivateKey();
  if (!privateKey) {
    return "New Message";
  }
  try {
    const decrypted_message = await CryptoHelper.decryptMessage(privateKey, sanitize(encrypted_message));
    return decrypted_message;
  } catch (error) {
    return "New Message";
  }
}

function sanitize(str) {
  return str
    .replace(/^"|"$/g, '')      // Remove leading/trailing literal quotes
    .replace(/\\n/g, '\n')      // Convert literal backslash+n to real newlines
    .trim()
}