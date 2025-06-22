export function check_notification_access() {
  if (Notification.permission !== "granted" || Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

export function show_notification(data) {
  if (Notification.permission === "granted") {
    const notification = new Notification(data.title, {
      body: data.body,
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