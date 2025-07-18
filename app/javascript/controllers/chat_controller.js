import { Controller } from "@hotwired/stimulus"
import { add, format, isToday, isYesterday } from 'date-fns'

// Connects to data-controller="chat"
export default class extends Controller {
  connect() {
    this.initializeAlphineElements()
    this.observer = new MutationObserver((mutations) => {
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

  append(event) {
    event.preventDefault();
    let chat_form = document.querySelector("#chat_form");
    let temp_chat_id_element = chat_form.querySelector("#new_chat_temporary_chat_id");
    let message_element = chat_form.querySelector("#new_chat_message");
    let attachments_element = chat_form.querySelector("#new_chat_attachments");
    if (temp_chat_id_element.value == "" || temp_chat_id_element.value == null) {
      let message = message_element.value;
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
      let temp_id = `${group_id}_temp_chat_id_${Date.now()}`;
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

      newTemplate = newTemplate
        .replace("{{CHAT_ID}}", temp_id)
        .replace("{{MESSAGE}}", message)
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
    //Send request to server by submitting the request
    chat_form.requestSubmit();
    this.scrollToBottom();
  }

  reset(event) {
    let chat_form = document.querySelector("#chat_form");
    let temp_chat_id_element = chat_form.querySelector("#new_chat_temporary_chat_id");
    let message_element = chat_form.querySelector("#new_chat_message");
    let attachments_element = chat_form.querySelector("#new_chat_attachments");
    let cleanup_attachments = chat_form.querySelectorAll('input[type="hidden"][name="new_chat[attachments][]"]');

    message_element.value = "";
    temp_chat_id_element.value = "";
    attachments_element.value = "";

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

  appendDate(chat_list) {
    const date = new Date().toISOString().slice(0, 10);
    const separatorExists = document.querySelector(`.date-separator[data-date="${date}"]`);
    if (!separatorExists) {
      let newTemplate = this.getDateSeperatorTemplate(date);
      chat_list.insertAdjacentHTML("beforeend", newTemplate);
    }
  }

  checkDateSeperatorOnMessage(node) {
    const date = new Date().toISOString().slice(0, 10);
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
      .replace("{{FORMATED_DATE}}", this.formatDateSeparator(date));

    return newTemplate;
  }

  formatDateSeparator(date) {
    if (isToday(date)) {
      return "Today";
    }

    if (isYesterday(date)) {
      return "Yesterday";
    }

    return format(date, 'MMMM d, yyyy');
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
    message_bubble.lastChild.remove();
    let reply_container = message_bubble.querySelector(".reply-container");
    if (reply_container) {
      reply_container.remove();
    }

    //preparing template
    let original_message = message_bubble.firstElementChild;
    for (let ele of original_message.children) {
      ele.classList.add("text-xs")
      ele.classList.add("italic")
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
}
