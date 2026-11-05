import { Controller } from "@hotwired/stimulus"
import { searchEmojis, emojiCategoriesWithRecent, rememberEmoji } from "helpers/emoji_data"
import { sendReaction } from "helpers/chat_helper"

// Full emoji picker for reacting to a message, opened from the "+" in a message's quick reactions.
// One picker is shared by every message in the chat window.
// Connects to data-controller="reaction-picker"
export default class extends Controller {
  static targets = ["overlay", "search", "categories", "grid"]
  static values = { url: String }

  open(event) {
    this.chatId = event.params.chatId;
    this.searchTarget.value = "";
    this.renderCategories();
    this.renderEmojis();
    this.overlayTarget.classList.remove("hidden");
    // Focusing on phones would pop up the keyboard over the emojis
    if (window.matchMedia("(min-width: 768px)").matches) this.searchTarget.focus();
  }

  close() {
    this.overlayTarget.classList.add("hidden");
  }

  closeOnBackdrop(event) {
    if (event.target == event.currentTarget) this.close();
  }

  closeOnEscape(event) {
    if (event.key == "Escape") this.close();
  }

  search() {
    this.renderEmojis();
  }

  renderCategories() {
    const buttons = emojiCategoriesWithRecent().map(category => {
      const button = document.createElement("button");
      button.type = "button";
      button.title = category.name;
      button.textContent = category.icon;
      button.className = "flex-shrink-0 w-8 h-8 rounded-md text-lg hover:bg-[var(--background-clr-strong)]";
      button.addEventListener("click", () => this.scrollToCategory(category.name));
      return button;
    });
    this.categoriesTarget.replaceChildren(...buttons);
  }

  renderEmojis() {
    const query = this.searchTarget.value;
    if (query.trim() != "") {
      const results = searchEmojis(query);
      this.gridTarget.replaceChildren(results.length > 0 ? this.emojiSection(null, results) : this.emptyMessage());
      return;
    }
    this.gridTarget.replaceChildren(...emojiCategoriesWithRecent().map(category => this.emojiSection(category.name, category.emojis)));
  }

  emojiSection(name, emojis) {
    const section = document.createElement("div");
    if (name) {
      section.dataset.category = name;
      const heading = document.createElement("p");
      heading.className = "px-1 pt-2 pb-1 text-xs font-semibold text-[var(--txt-clr-muted)]";
      heading.textContent = name;
      section.append(heading);
    }
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-8";
    for (const emoji of emojis) {
      const button = document.createElement("button");
      button.type = "button";
      button.title = emoji.keywords;
      button.textContent = emoji.char;
      button.className = "h-9 rounded-md text-xl hover:bg-[var(--background-clr-strong)]";
      button.addEventListener("click", () => this.select(emoji));
      grid.append(button);
    }
    section.append(grid);
    return section;
  }

  emptyMessage() {
    const message = document.createElement("p");
    message.className = "p-4 text-center text-sm text-[var(--txt-clr-muted)]";
    message.textContent = "No emojis found";
    return message;
  }

  scrollToCategory(name) {
    this.searchTarget.value = "";
    this.renderEmojis();
    const section = this.gridTarget.querySelector(`[data-category="${name}"]`);
    if (section) this.gridTarget.scrollTop = section.offsetTop - this.gridTarget.offsetTop;
  }

  select(emoji) {
    rememberEmoji(emoji);
    sendReaction(this.urlValue, this.chatId, emoji.char);
    this.close();
  }
}
