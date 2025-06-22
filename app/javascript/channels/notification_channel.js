import consumer from "./consumer"
import { check_notification_access, show_notification } from "../browser_notifications"

consumer.subscriptions.create("NotificationChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
    console.log("Connected");
    check_notification_access();
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
    console.log("Disconnected");
  },

  received(data) {
    show_notification(data);
    // Called when there's incoming data on the websocket for this channel\
    // document.body.insertAdjacentHTML('beforeend', data.turbo_stream_ui);
  }
});
