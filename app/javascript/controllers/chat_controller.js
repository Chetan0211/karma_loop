import { Controller } from "@hotwired/stimulus"
import { add, format, isToday, isYesterday } from 'date-fns'
import CryptoHelper from "helpers/crypto_helper"
import KeyManager from "key_manager"
import { formatDateSeparator, createAttachmentThumbnail, sendReaction } from "helpers/chat_helper"
import { buildMediaMessage, parseMediaMessage, createMediaElement } from "helpers/media_message_helper"
import consumer from "channels/consumer"

// Connects to data-controller="chat"
export default class extends Controller {
  async connect() {
    this.initializeAlphineElements()
    KeyManager.initialize();
    this.privateKey = await KeyManager.getPrivateKey();
    if (!this.privateKey) { 
      KeyManager.logoutUser();
    }
    this.observer = new MutationObserver((mutations) => {
      // Older pages come with their own date headers, so a day split across two pages gets two
      if (mutations.some(mutation => [...mutation.addedNodes].some(node => node.nodeType === 1 && node.matches(".date-separator")))) {
        this.removeDuplicateDateSeparators();
      }
      mutations.forEach((mutation) => {
        // For every node that was added...
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.matches('.chat-message')) {
            this.checkDateSeperatorOnMessage(node);
            this.scrollToBottom();
            if (node.dataset.chatRead === 'false') {
              this.visibilityObserver.observe(node);
            }
          }
        })
      })
    });

    this.visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const messageElement = entry.target;
          this.markMessageAsRead(messageElement);
          // Once a message is marked as read, stop observing it.
          this.visibilityObserver.unobserve(messageElement);
        }
      });
    });

    this.fetchNewMessageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          this.fetchMessages(element.firstElementChild);
        }
      });
    });


    this.element.querySelectorAll('.chat-message').forEach(message => {
      if (message.dataset.chatRead === 'false') {
        this.addUnreadMessageBar(message);
        this.visibilityObserver.observe(message);
      }
    });

    let group = this.element.dataset.groupId;
    let chat_list = document.querySelector(`#chat_list_${group}`);
    let scroll_area = document.querySelector("#chat_scroll_area");
    let unread = chat_list.querySelector(".chat-unread-separator");
    if (unread != null) {
      unread.scrollIntoView();
    }
    else {
      scroll_area.scrollTop = scroll_area.scrollHeight;
    }


    this.observer.observe(chat_list, { childList: true });

    let fetch_new_message_element = document.querySelector(`#fetch_chat_messages_${group}`);
    this.fetchNewMessageObserver.observe(fetch_new_message_element);
  }

  initializeAlphineElements() {
    window.Alpine.data('chat', () => ({
      isAttachmentModalOpen: false,
      attachmentMenuOpen: false,
      showAttachmentMenu: false,
      showAttachmentData: null,
      showReplyBanner: false,
      isUploading: false,
      uploadProgress: 0,
      attachments: [],
      init() {
        this.$nextTick(() => {
          let video_input = document.getElementById("new_chat_attachments");
          video_input.addEventListener('direct-upload:initialize', () => {
            // this triggers after initialization
            this.isUploading = true;
          });

          video_input.addEventListener('direct-upload:start', () => {
          });

          video_input.addEventListener('direct-upload:end', () => {
            this.isAttachmentModalOpen = false;
            this.attachments = [];
            this.isUploading = false;
          });

          video_input.addEventListener('direct-upload:error', () => {
            this.isAttachmentModalOpen = false;
            this.attachments = [];
            this.isUploading = false;
          });

          video_input.addEventListener('direct-upload:progress', (e) => {
            this.uploadProgress = Math.round(e.detail.progress);
          });
        });
      },
      sendMessage() {
        const dataTransfer = new DataTransfer();
        for (let file of this.$refs.imageInput.files) {
          dataTransfer.items.add(file);
        }
        for (let file of this.$refs.videoInput.files) {
          dataTransfer.items.add(file);
        }
        for (let file of this.$refs.documentInput.files) {
          dataTransfer.items.add(file);
        }
        this.$refs.chat_attachments.files = dataTransfer.files;
        this.$refs.chat_form_submit_button.click();
      },
      selectedAttachments(event) {
        for (let file of event.target.files) {
          this.attachments.push(file);
        }
        this.isAttachmentModalOpen = true;
      },
      removeAttachment(index) {
        this.attachments.splice(index, 1);
      }
    }));
  }

  addUnreadMessageBar(node) {
    let templateElement = document.querySelector('[data-chat-target="chat_unread_bar"]').content.cloneNode(true);
    let newTemplate = templateElement.firstElementChild.outerHTML;
    let group_id = chat_form.dataset.groupId;
    let chat_list = document.querySelector(`#chat_list_${group_id}`);
    if (chat_list.querySelector(".chat-unread-separator") == null) {
      node.insertAdjacentHTML('beforebegin', newTemplate);
    }
  }

  react(event) {
    const { url, chatId, reaction } = event.currentTarget.dataset;
    sendReaction(url, chatId, reaction);
  }

  markMessageAsRead(node) {
    node.dataset.chatRead = "true";
    let readUrl = node.dataset.readUrl;
    fetch(readUrl, { method: 'GET' });
  }

  scrollToBottom() {
    let scroll_area = document.querySelector("#chat_scroll_area");
    if ((scroll_area.scrollHeight - scroll_area.scrollTop) < 1000) {
      scroll_area.scrollTop = scroll_area.scrollHeight;
    }
  }

  // Show the scroll-to-latest button once the user has scrolled up away from the newest messages
  toggleScrollToLatest() {
    let scroll_area = document.querySelector("#chat_scroll_area");
    let button = document.querySelector("#scroll_to_latest_button");
    let distanceFromBottom = scroll_area.scrollHeight - scroll_area.scrollTop - scroll_area.clientHeight;
    button.classList.toggle("hidden", distanceFromBottom < 200);
  }

  // A GIF or sticker picked in the media picker is sent straight away as its own encrypted message,
  // leaving whatever the user has typed in the message box
  async sendMedia(event) {
    let input = document.querySelector("#new_chat_temp_message");
    let draft = input.value;
    input.value = buildMediaMessage(event.detail.type, event.detail.item);
    await this.append(event);
    input.value = draft;
  }

  scrollToLatest() {
    let scroll_area = document.querySelector("#chat_scroll_area");
    scroll_area.scrollTo({ top: scroll_area.scrollHeight, behavior: "smooth" });
  }

  async append(event) {
    event.preventDefault();
    let chat_form = document.querySelector("#chat_form");
    let temp_chat_id_element = chat_form.querySelector("#new_chat_temporary_chat_id");
    let message_element = chat_form.querySelector("#new_chat_message");
    let temp_message_element = chat_form.querySelector("#new_chat_temp_message");
    let attachments_element = chat_form.querySelector("#new_chat_attachments");
    let chat_pub_keys = JSON.parse(chat_form.dataset.chatPubKeys);
    if (temp_chat_id_element.value == "" || temp_chat_id_element.value == null) {
      let message = temp_message_element.value;
      let attachments = [];
      for (let file of attachments_element.files) {

        attachments.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file)
        });
      }
      let templateElement = document.querySelector('[data-chat-form-target="chat_sent_template"]').content.cloneNode(true);
      let newTemplate = templateElement.firstElementChild.outerHTML;
      let group_id = chat_form.dataset.groupId;
      let temp_id = `temp_chat_id_${group_id}_${Date.now()}`;
      temp_chat_id_element.value = temp_id;
      let now = new Date();
      let reply_message = document.getElementById("form_replying_to").innerHTML;
      let form_reply_field = document.getElementById("new_chat_reply_to_id");

      if (form_reply_field.value != "" || form_reply_field.value != null) {
        newTemplate = newTemplate.replace("{{MESSAGE_REPLY}}", reply_message);
      }
      else {
        newTemplate = newTemplate.replace("{{MESSAGE_REPLY}}", "");
      }

      // Show a GIF or sticker straight away instead of its JSON payload
      let media = parseMediaMessage(message);
      let message_html = media ? createMediaElement(media).outerHTML : message;

      newTemplate = newTemplate
        .replace("{{CHAT_ID}}", temp_id)
        .replace("{{MESSAGE}}", () => message_html)
        .replace("{{DATE}}", now.toISOString().slice(0, 10))
        .replace("{{MESSAGE_TIME}}", `${now.getHours()}:${now.getMinutes()}`);


      let chat_list = document.querySelector(`#chat_list_${group_id}`);

      //Append the date seperator if not exists
      this.appendDate(chat_list);


      if (chat_list.querySelector(`#empty_chat_window_${group_id}`)) {
        chat_list.querySelector(`#empty_chat_window_${group_id}`).remove();
      }
      chat_list.insertAdjacentHTML("beforeend", newTemplate);

      let new_message = document.querySelector(`#${temp_id}`);

      new_message.addEventListener('new_chat_component:ready', () => {
        setTimeout(() => {
          new_message.dispatchEvent(new CustomEvent('set-attachments', { detail: { attachments: attachments } }))
        }, 0);
      }, { once: true });

      if (chat_list.querySelector(".chat-unread-separator") != null) {
        chat_list.querySelector(".chat-unread-separator").remove();
      }
    }
    //Encrypt the chats and attachments
    if (temp_message_element.value != "") {
      let encryptedMessage = await CryptoHelper.encryptMessage(chat_pub_keys, temp_message_element.value);
      message_element.value = JSON.stringify(encryptedMessage);
      temp_message_element.value = "";
    }
    // After uploading, ActiveStorage clicks submit again with the file input disabled.
    // Only encrypt on the first pass so the manifest keeps matching the uploaded blobs.
    if (attachments_element.files.length > 0 && !attachments_element.disabled) {
      let manifest_element = chat_form.querySelector("#new_chat_attachments_manifest");
      let encrypted_files = new DataTransfer();
      let manifest = [];
      for (let file of attachments_element.files) {
        let { file: encrypted_file, metadata } = await CryptoHelper.encryptAttachment(file);
        metadata.thumbnail = await createAttachmentThumbnail(file);
        encrypted_files.items.add(encrypted_file);
        manifest.push(metadata);
      }
      attachments_element.files = encrypted_files.files;
      let encryptedManifest = await CryptoHelper.encryptMessage(chat_pub_keys, JSON.stringify(manifest));
      manifest_element.value = JSON.stringify(encryptedManifest);
    }

    //Send request to server by submitting the request
    chat_form.requestSubmit();
    this.scrollToBottom(); 
  }

  reset(event) {
    let chat_form = document.querySelector("#chat_form");
    let temp_chat_id_element = chat_form.querySelector("#new_chat_temporary_chat_id");
    let message_element = chat_form.querySelector("#new_chat_message");
    let attachments_element = chat_form.querySelector("#new_chat_attachments");
    let manifest_element = chat_form.querySelector("#new_chat_attachments_manifest");
    let cleanup_attachments = chat_form.querySelectorAll('input[type="hidden"][name="new_chat[attachments][]"]');

    message_element.value = "";
    manifest_element.value = "";
    temp_chat_id_element.value = "";
    attachments_element.value = "";
    // ActiveStorage leaves the input disabled after a direct upload, which would drop the next attachments
    attachments_element.disabled = false;

    cleanup_attachments.forEach(element => {
      element.remove();
    });
    this.removeReplyMessage();
  }

  attachmentViewer(event) {
    let x = event.currentTarget;
    let data = {
      type: x.dataset.fileFormat,
      url: x.dataset.url
    }
    let show_attachment = document.querySelector("#show_attachment");
    show_attachment.dispatchEvent(new CustomEvent('set-show-attachment-data', { detail: { data: data, showMenu: true } }))
  }

  // Clicking a quoted reply jumps to the original message, if it's loaded
  scrollToMessage(event) {
    let message = document.getElementById(event.currentTarget.dataset.replyToId);
    if (!message) return;

    message.scrollIntoView({ behavior: "smooth", block: "center" });
    let bubble = message.querySelector(".message-bubble") || message;
    bubble.animate(
      [{ outline: "2px solid var(--primary-500)", outlineOffset: "2px", borderRadius: "1rem" }, { outline: "2px solid transparent", outlineOffset: "2px", borderRadius: "1rem" }],
      { duration: 1500, easing: "ease-out" }
    );
  }

  appendDate(chat_list) {
    const date = new Date().toISOString().slice(0, 10);
    const separatorExists = document.querySelector(`.date-separator[data-date="${date}"]`);
    if (!separatorExists) {
      let newTemplate = this.getDateSeperatorTemplate(date);
      chat_list.insertAdjacentHTML("beforeend", newTemplate);
    }
  }

  // Keeps the first header for each date; it sits above the earliest message of that day
  removeDuplicateDateSeparators() {
    const seen = new Set();
    this.element.querySelectorAll(".date-separator").forEach(separator => {
      if (seen.has(separator.dataset.date)) separator.remove();
      else seen.add(separator.dataset.date);
    });
  }

  checkDateSeperatorOnMessage(node) {
    const date = node.dataset.date;
    const separatorExists = document.querySelector(`.date-separator[data-date="${date}"]`);
    if (!separatorExists) {
      let newTemplate = this.getDateSeperatorTemplate(date);
      node.insertAdjacentHTML('beforebegin', newTemplate);
    }
  }

  getDateSeperatorTemplate(date) {
    let templateElement = document.querySelector('[data-chat-target="chat_date"]').content.cloneNode(true);
    let newTemplate = templateElement.firstElementChild.outerHTML;

    newTemplate = newTemplate
      .replace("{{DATE}}", date)
      .replace("{{FORMATED_DATE}}", formatDateSeparator(date));

    return newTemplate;
  }

  replyMessage(event) {
    this.removeReplyMessage();
    let message_reply_button_event = event.currentTarget;
    let chat_id = message_reply_button_event.dataset.chatId;
    let chat_username = message_reply_button_event.dataset.username;
    let reply_template_element = document.querySelector("[data-chat-target='chat_reply_template']").content.cloneNode(true);
    let reply_template = reply_template_element.firstElementChild;

    //preparing message
    let reply_message_clone = document.getElementById(chat_id).cloneNode(true);
    let message_bubble = reply_message_clone.querySelector(".message-bubble");
    message_bubble.querySelector(`#chat_${chat_id}_seen_status`).remove();
    message_bubble.querySelector(".chat-reactions")?.remove();
    let reply_container = message_bubble.querySelector(".reply-container");
    if (reply_container) {
      reply_container.remove();
    }
    // Show a GIF or sticker small in the reply banner
    message_bubble.querySelectorAll('[data-message-decryption-display-value="full"]').forEach(element => {
      element.dataset.messageDecryptionDisplayValue = "reply";
    });

    //preparing template
    let original_message = message_bubble.firstElementChild;
    for (let ele of original_message.children) {
      ele.classList.add("text-xs")
      ele.classList.add("italic")
      ele.classList.add("truncate")
    }
    reply_template.insertAdjacentHTML("beforeend", original_message.innerHTML);
    reply_template = reply_template.outerHTML;

    if (chat_username == "You") {
      reply_template = reply_template.replaceAll("{{CURRENT_USER}}", "true");
    }
    else {
      reply_template = reply_template.replaceAll("{{CURRENT_USER}}", "false");
    }
    reply_template = reply_template.replaceAll("{{USER_NAME}}", chat_username)


    let reply_message_container = document.getElementById("form_replying_to");
    reply_message_container.insertAdjacentHTML("beforeend", reply_template);

    let form_reply_field = document.getElementById("new_chat_reply_to_id");
    form_reply_field.value = chat_id;
  }

  removeReplyMessage() {
    let reply_message_container = document.getElementById("form_replying_to");
    reply_message_container.innerHTML = "";

    let form_reply_field = document.getElementById("new_chat_reply_to_id");
    form_reply_field.value = null;
  }

  fetchMessages(event) {
    let url = event.dataset.url;
    if (!event.dataset.eof) {
      let loader = document.querySelector("#fetch_chat_loader");
      loader.classList.remove("hidden");
      let scroll_area = document.querySelector("#chat_scroll_area");
      const oldScrollHeight = scroll_area.scrollHeight;

      fetch(url, { method: 'GET', headers: { 'Accept': 'text/vnd.turbo-stream.html' } })
        .then(response => response.text())
        .then(html => {
          Turbo.renderStreamMessage(html)
          loader.classList.add("hidden");
          requestAnimationFrame(() => {
            const newScrollHeight = scroll_area.scrollHeight;
            scroll_area.scrollTop = newScrollHeight - oldScrollHeight;
          })
        })
    }
  }
}
