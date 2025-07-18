import consumer from "./consumer"
import { check_notification_access, show_notification } from "../browser_notifications"

const coordinator = new BroadcastChannel('tab_rank_coordinator');
window.coordinator = coordinator;
const tabId = Math.random();
let allTabs = [];
let myRank = 0;

consumer.subscriptions.create("NotificationChannel", {
  connected() {
    // Called when the subscription is ready for use on the server\
    check_notification_access();
    allTabs.push(tabId);
    coordinator.postMessage({ type: 'PING', id: tabId });
    recalculateRanks();
  },

  disconnected() {
    // Called when the subscription has been terminated by the server\
    coordinator.postMessage({ type: 'LEAVING', id: tabId });
  },

  received(data) {
    if (myRank === 1) {
      show_notification(data);
    }
    // Called when there's incoming data on the websocket for this channel\
    // document.body.insertAdjacentHTML('beforeend', data.turbo_stream_ui);
  }
});

function recalculateRanks() {
  // Get all tab IDs and sort them. Sorting provides a stable, deterministic order.
  // Every tab will have the exact same sorted list.
  const sortedTabIds = allTabs.sort();
  // Find this tab's index in the sorted list. The rank is the index + 1.
  const myIndex = sortedTabIds.indexOf(tabId);
  myRank = myIndex + 1; // Rank is 1-based (1, 2, 3...)
}

coordinator.onmessage = (event) => {
  const { type, id } = event.data;

  if (type === 'PING' && id !== tabId) {
    // A tab (or this one) has announced its presence. Add it to our list.
    if (!allTabs.includes(id)) {
      allTabs.push(id);
    }
    coordinator.postMessage({ type: `PONG_${id}`, id: tabId });
    recalculateRanks();
  }

  if (type === `PONG_${tabId}`) {
    if (!allTabs.includes(id)) {
      allTabs.push(id);
    }
    recalculateRanks();
  } 
  if(type === 'LEAVING'&& id !== tabId) {
    allTabs = allTabs.filter(tab => tab !== id);
    recalculateRanks();
  }
};