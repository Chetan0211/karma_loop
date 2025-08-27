import { Controller } from "@hotwired/stimulus"
import { parentLikeToggle } from "../../helpers/post_helper";

// Connects to data-controller="home--index"
export default class extends Controller {
  connect() {
    parentLikeToggle();
    this.setupFetchPosts();
  }

  setupFetchPosts() {
    this.fetchNewMessageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          this.fetchPosts(element.firstElementChild);
        }
      });
    });

    let fetch_posts = document.querySelector("#fetch_posts");
    if (fetch_posts) {
      this.fetchNewMessageObserver.observe(fetch_posts);
    }
  }

  fetchPosts(element) {
    let url = element.dataset.url;
    if (!element.dataset.eof) {
      let loader = document.querySelector("#fetch_posts_loader");
      loader.classList.remove("hidden");

      fetch(url, { method: 'GET', headers: { 'Accept': 'text/vnd.turbo-stream.html' } })
        .then(response => response.text())
        .then(html => {
          Turbo.renderStreamMessage(html)
          loader.classList.add("hidden");
        })
    }
  }
}
