import { Controller } from "@hotwired/stimulus"
import { searchEmojis, emojiCategoriesWithRecent, rememberEmoji } from "helpers/emoji_data"

const SEARCH_DELAY = 400;

// Emoji, GIF and sticker picker beside the chat input.
// Emojis are inserted into the message box; GIFs and stickers dispatch "media-selected" for chat#sendMedia.
// Connects to data-controller="media-picker"
export default class extends Controller {
  static targets = ["tab", "emojiPanel", "emojiSearch", "emojiCategories", "emojiGrid", "giphyPanel", "giphySearch", "giphyGrid", "giphyStatus", "giphyChips"]
  static values = { searchUrl: String }

  connect() {
    this.kind = "emoji";
    // Results already loaded per kind, so switching tabs doesn't search again
    this.giphyState = {
      gifs: { query: "", items: [], nextOffset: 0 },
      stickers: { query: "", items: [], nextOffset: 0 }
    };
    this.requestId = 0;
    this.renderEmojiCategories();
    this.renderEmojis();
  }

  disconnect() {
    clearTimeout(this.searchTimer);
  }

  switchTab(event) {
    this.kind = event.params.kind;
    this.tabTargets.forEach(tab => {
      const active = tab.dataset.mediaPickerKindParam == this.kind;
      tab.classList.toggle("text-[var(--primary-500)]", active);
      tab.classList.toggle("border-[var(--primary-500)]", active);
      tab.classList.toggle("border-transparent", !active);
    });
    this.emojiPanelTarget.classList.toggle("hidden", this.kind != "emoji");
    this.giphyPanelTarget.classList.toggle("hidden", this.kind == "emoji");
    if (this.kind == "emoji") return;

    const state = this.giphyState[this.kind];
    this.giphySearchTarget.value = state.query;
    this.giphySearchTarget.placeholder = this.kind == "gifs" ? "Search GIFs" : "Search stickers";
    this.renderChips();
    if (state.items.length == 0) {
      this.loadGiphy(true);
    } else {
      this.renderGiphy();
    }
  }

  // The search boxes sit inside the chat form, so Enter would send the message
  preventSubmit(event) {
    event.preventDefault();
  }

  // ---- Emojis ----

  // Called when the picker opens, so recently used emojis are up to date
  refreshEmojis() {
    if (this.kind != "emoji") return;
    this.renderEmojiCategories();
    this.renderEmojis();
  }

  renderEmojiCategories() {
    const buttons = emojiCategoriesWithRecent().map(category => {
      const button = document.createElement("button");
      button.type = "button";
      button.title = category.name;
      button.textContent = category.icon;
      button.className = "flex-shrink-0 w-8 h-8 rounded-md text-lg hover:bg-[var(--background-clr-strong)]";
      button.addEventListener("click", () => this.scrollToCategory(category.name));
      return button;
    });
    this.emojiCategoriesTarget.replaceChildren(...buttons);
  }

  renderEmojis() {
    const query = this.emojiSearchTarget.value;
    if (query.trim() != "") {
      const results = searchEmojis(query);
      this.emojiGridTarget.replaceChildren(results.length > 0 ? this.emojiSection(null, results) : this.emptyMessage("No emojis found"));
      return;
    }
    this.emojiGridTarget.replaceChildren(...emojiCategoriesWithRecent().map(category => this.emojiSection(category.name, category.emojis)));
  }

  searchEmojis() {
    this.renderEmojis();
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
      button.addEventListener("click", () => this.insertEmoji(emoji));
      grid.append(button);
    }
    section.append(grid);
    return section;
  }

  scrollToCategory(name) {
    this.emojiSearchTarget.value = "";
    this.renderEmojis();
    const section = this.emojiGridTarget.querySelector(`[data-category="${name}"]`);
    if (section) this.emojiGridTarget.scrollTop = section.offsetTop - this.emojiGridTarget.offsetTop;
  }

  // Puts the emoji where the cursor is in the message box
  insertEmoji(emoji) {
    const input = document.querySelector("#new_chat_temp_message");
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = input.value.slice(0, start) + emoji.char + input.value.slice(end);
    const cursor = start + emoji.char.length;
    input.setSelectionRange(cursor, cursor);
    rememberEmoji(emoji);
  }


  // ---- GIFs and stickers ----

  searchGiphy() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.giphyState[this.kind].query = this.giphySearchTarget.value.trim();
      this.loadGiphy(true);
    }, SEARCH_DELAY);
  }

  selectChip(event) {
    this.giphySearchTarget.value = event.params.query;
    this.giphyState[this.kind].query = event.params.query;
    this.loadGiphy(true);
  }

  // Loads the next page once the user scrolls near the end of the results
  giphyScroll() {
    const grid = this.giphyGridTarget;
    if (grid.scrollHeight - grid.scrollTop - grid.clientHeight < 200) this.loadGiphy(false);
  }

  async loadGiphy(reset) {
    const kind = this.kind;
    const state = this.giphyState[kind];
    if (reset) {
      state.items = [];
      state.nextOffset = 0;
      this.loading = false;
      this.giphyGridTarget.scrollTop = 0;
    }
    if (this.loading || state.nextOffset == null) return;

    this.loading = true;
    const requestId = ++this.requestId;
    this.setGiphyStatus(state.items.length == 0 ? "Loading..." : "");
    if (reset) this.giphyGridTarget.replaceChildren();

    try {
      const params = new URLSearchParams({ kind: kind, q: state.query, offset: state.nextOffset });
      const response = await fetch(`${this.searchUrlValue}?${params}`, { headers: { "Accept": "application/json" } });
      const data = await response.json();
      // A newer search started while this one was loading
      if (requestId != this.requestId) return;
      if (!response.ok) throw new Error(data.error);

      state.items.push(...data.results);
      state.nextOffset = data.next_offset;
      if (this.kind == kind) this.renderGiphy();
    } catch (error) {
      if (requestId == this.requestId) this.setGiphyStatus("Couldn't load GIFs. Try again in a moment.");
    } finally {
      if (requestId == this.requestId) this.loading = false;
    }
  }

  renderGiphy() {
    const state = this.giphyState[this.kind];
    if (state.items.length == 0) {
      this.giphyGridTarget.replaceChildren();
      this.setGiphyStatus("Nothing found");
      return;
    }
    this.setGiphyStatus("");
    const buttons = state.items.map(item => {
      const button = document.createElement("button");
      button.type = "button";
      button.title = item.title;
      button.className = "block w-full mb-2 rounded-md overflow-hidden hover:opacity-80";
      button.style.breakInside = "avoid";
      if (this.kind == "gifs") button.classList.add("bg-[var(--background-clr-strong)]");

      const image = document.createElement("img");
      image.src = item.preview_url;
      image.alt = item.title;
      image.loading = "lazy";
      image.width = item.width;
      image.height = item.height;
      image.className = "block w-full";
      image.style.height = "auto";
      button.append(image);

      const type = this.kind == "gifs" ? "gif" : "sticker";
      button.addEventListener("click", () => this.dispatch("media-selected", { prefix: false, detail: { type: type, item: item } }));
      return button;
    });
    this.giphyGridTarget.replaceChildren(...buttons);
  }

  renderChips() {
    const chips = this.kind == "gifs"
      ? ["Haha", "Love", "Yes", "No", "OMG", "Thank you", "Hello", "Sad"]
      : ["Hi", "Love", "LOL", "Thanks", "Cute", "Party", "Sad", "Wow"];
    this.giphyChipsTarget.replaceChildren(...chips.map(chip => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = chip;
      button.dataset.action = "click->media-picker#selectChip";
      button.dataset.mediaPickerQueryParam = chip;
      button.className = "flex-shrink-0 px-3 py-1 rounded-full text-xs bg-[var(--background-clr-strong)] text-[var(--txt-clr-default)] hover:bg-[var(--background-clr-thick)]";
      return button;
    }));
  }

  setGiphyStatus(text) {
    this.giphyStatusTarget.textContent = text;
    this.giphyStatusTarget.classList.toggle("hidden", text == "");
  }

  emptyMessage(text) {
    const message = document.createElement("p");
    message.className = "p-4 text-center text-sm text-[var(--txt-clr-muted)]";
    message.textContent = text;
    return message;
  }
}
