import { Controller } from "@hotwired/stimulus"
import { format, isToday, isYesterday } from "date-fns"

const REFRESH_INTERVAL = 30 * 1000;

// Shows "Last seen ..." relative to now and keeps it current while the chat stays open
// Connects to data-controller="last-seen"
export default class extends Controller {
  static values = { at: String }

  connect() {
    this.render();
    this.timer = setInterval(() => this.render(), REFRESH_INTERVAL);
  }

  disconnect() {
    clearInterval(this.timer);
  }

  render() {
    this.element.textContent = `Last seen ${this.describe(new Date(this.atValue))}`;
  }

  describe(at) {
    const minutes = Math.floor((Date.now() - at.getTime()) / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} ${minutes == 1 ? "minute" : "minutes"} ago`;
    if (isToday(at)) {
      const hours = Math.floor(minutes / 60);
      return `${hours} ${hours == 1 ? "hour" : "hours"} ago`;
    }
    if (isYesterday(at)) return "yesterday";
    return `on ${format(at, at.getFullYear() == new Date().getFullYear() ? "MMM d" : "MMM d, yyyy")}`;
  }
}
