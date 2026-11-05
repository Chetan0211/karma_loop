import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="chat--index"
export default class extends Controller {
  static values = { openChatUrl: String }

  connect() {
    this.setupFetchGroups();
    if (this.hasOpenChatUrlValue) this.openChat(this.openChatUrlValue);
  }

  // Opens a specific chat on page load, e.g. when coming from a user's profile.
  openChat(url) {
    fetch(url, { method: 'GET', headers: { 'Accept': 'text/vnd.turbo-stream.html' } })
      .then(response => response.text())
      .then(html => Turbo.renderStreamMessage(html))
  }
  setupFetchGroups() {
    this.fetchNewMessageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          this.fetchGroups(element.firstElementChild);
        }
      });
    });

    let fetch_groups = document.querySelector("#fetch_groups");
    this.fetchNewMessageObserver.observe(fetch_groups);
  }

  fetchGroups(element) {
    let url = element.dataset.url;
    if (!element.dataset.eof) {
      let loader = document.querySelector("#fetch_groups_loader");
      loader.classList.remove("hidden");

      fetch(url, { method: 'GET', headers: { 'Accept': 'text/vnd.turbo-stream.html' } })
        .then(response => response.text())
        .then(html => {
          Turbo.renderStreamMessage(html)
          loader.classList.add("hidden");
        })
    }
  }

  fetchChat(element) {
    // On clicking the message we need to fetch the chat of that particular user or group.
  }
}
