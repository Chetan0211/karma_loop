import { Controller } from "@hotwired/stimulus"
import { add, format, isToday, isYesterday } from 'date-fns'
import CryptoHelper from "../helpers/crypto_helper"
import KeyManager from "../key_manager"
import { formatDateSeparator } from "../helpers/chat_helper"
import consumer from "../channels/consumer"

// Connects to data-controller="chat"
export default class extends Controller {
  async connect() {
    KeyManager.initialize();
    this.privateKey = await KeyManager.getPrivateKey();
    if (!this.privateKey) { 
      KeyManager.logoutUser();
    }
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

    this.fetchNewMessageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          this.fetchMessages(element.firstElementChild);
        }
      });
    });


    // this.element.querySelectorAll('.chat-message').forEach(message => {
    //   if (message.dataset.chatRead === 'false') {
    //     this.addUnreadMessageBar(message);
    //     this.visibilityObserver.observe(message);
    //   }
    // });

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

    this.chatChannel = consumer.subscriptions.create("ChatChannel", {
      connected() { 
        console.log("Connected to ChatChannel");
      },
      received(data) {
        // Handle incoming chat messages
        console.log("Received chat message:", data);
      }
    });
  }

  // addUnreadMessageBar(node) {
  //   let templateElement = document.querySelector('[data-chat-target="chat_unread_bar"]').content.cloneNode(true);
  //   let newTemplate = templateElement.firstElementChild.outerHTML;
  //   let group_id = chat_form.dataset.groupId;
  //   let chat_list = document.querySelector(`#chat_list_${group_id}`);
  //   if (chat_list.querySelector(".chat-unread-separator") == null) {
  //     node.insertAdjacentHTML('beforebegin', newTemplate);
  //   }
  // }

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

  async append(event) {
    event.preventDefault();
    let chat_form = document.querySelector("#chat_form");
    let temp_chat_id_element = chat_form.querySelector("#new_chat_temporary_chat_id");
    let message_element = chat_form.querySelector("#new_chat_message");
    let attachments_element = chat_form.querySelector("#new_chat_attachments");
    let chat_pub_keys = JSON.parse(chat_form.dataset.chatPubKeys);
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
    //Encrypt the chats and attachments
    if (message_element.value != "") {
      let encryptedMessage = await CryptoHelper.encryptMessage(chat_pub_keys, message_element.value);
      chat_form.querySelector("#new_chat_message").value = JSON.stringify(encryptedMessage);
    }
    if (attachments_element.files.length > 0) {
      // Need to encrypt attachments
      // const encryptedAttachments = await this.encryptAttachments(attachments_element.files, chat_pub_keys);
      // attachments_element.value = JSON.stringify(encryptedAttachments);
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

      fetch(url, { method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        .then(response => {
          return response.json()
        })
        .then(data => {
          this.constructMessages(data);
          loader.classList.add("hidden");
        })
    }
  }

  async constructMessages(responseData) {
    let pagy = responseData.pagy;
    const chat_form = document.querySelector("#chat_form");
    const group_id = chat_form.dataset.groupId;
    const chat_list_div = document.querySelector(`#chat_list_${group_id}`);
    let current_user = responseData.current_user;
    let chats = null;
    let lastUnreadMessageId = null;
    if (responseData.chats != null || responseData.chats != '') {
      chats = responseData.chats;
    }
    let messages = document.createElement('div');
    for (let chat of chats) {
      if (chat.chat_read == false) {
        lastUnreadMessageId = chat.id;
      }      
      let chatDate = new Date(chat.created_at);
      if (chat_list_div.querySelector(`.date-separator[data-date="${chatDate.toISOString().slice(0, 10)}"]`) == null) { 

      }
      let mainMessageTemplate = await this.constructMainMessage(chat, current_user);
      messages.insertAdjacentHTML('afterbegin', mainMessageTemplate);
    }

    //Setting up unread message bar
    if (lastUnreadMessageId != null) {
      if (chat_list_div.querySelector(".chat-unread-separator") != null) {
        chat_list_div.removeChild(chat_list_div.querySelector(".chat-unread-separator"));
      }
      let templateElement = document.querySelector('[data-chat-target="chat_unread_bar"]').content.cloneNode(true);
      let newTemplate = templateElement.firstElementChild.outerHTML;
      let lastUnreadMessage = messages.querySelector(`#${lastUnreadMessageId}`);
      lastUnreadMessage.insertAdjacentHTML('beforebegin', newTemplate);
    }
    chat_list_div.insertAdjacentHTML('afterbegin', messages.innerHTML);
  }

  async constructMainMessage(chat, current_user) {
    let mainMessageTemplateElement = document.querySelector('[data-chat-target="chat_message_main_template"]').content.cloneNode(true);
    let mainMessageTemplate = mainMessageTemplateElement.firstElementChild.outerHTML;
    let replyMessageTemplate = null;
    let attachmentsTemplate = null;
    let decryptedMessage = null;
    if (chat.message != null && chat.message != "") { 
      decryptedMessage = await CryptoHelper.decryptMessage(this.privateKey, JSON.parse(chat.message));
    }
    if (chat.reply_to) {
      replyMessageTemplate = this.constructReplyMessage(chat, current_user);
    }
    // Temporarily disbling the attachments
    if (chat.attachments_data && chat.attachments_data.length > 0 && false) { 
      attachmentsTemplate = this.constructAttachmentsMessage(chat, current_user);
    }

    let seenStatusTemplate = this.constructSeenStatus(chat, current_user);

    mainMessageTemplate = mainMessageTemplate
      .replace("{{CHAT_MESSAGE_REPLY_TEMPLATE}}", replyMessageTemplate == null ? "" : replyMessageTemplate)
      .replace("{{CHAT_MESSAGE_ATTACHMENTS_TEMPLATE}}", attachmentsTemplate == null ? "" : attachmentsTemplate)
      .replace("{{CHAT_SEEN_STATUS_TEMPLATE}}", seenStatusTemplate)
    mainMessageTemplate = mainMessageTemplate
      .replaceAll("{{CHAT_ID}}", chat.id)
      .replaceAll("{{CURRENT_USER_ID}}", current_user.id)
      .replaceAll("{{CHAT_USER_ID}}", chat.user_id)
      .replaceAll("{{CHAT_CREATED_AT_to_date}}", new Date(chat.created_at))
      .replaceAll("{{CHAT_READ}}", chat.chat_read)
      .replaceAll("chat_id=CHAT_ID", `chat_id=${chat.id}`)
      .replaceAll("{{CHAT_MESSAGE}}", decryptedMessage)
      .replaceAll("{{CHAT_DATA_USERNAME}}", chat.user_id == current_user.id ? 'You' : chat.user.username);
    
    return mainMessageTemplate;
  }

  constructReplyMessage(chat, current_user) { 
    let replyMessageTemplateElement = document.querySelector('[data-chat-target="chat_message_reply_to_present_template"]').content.cloneNode(true);
    let replyMessageTemplate = replyMessageTemplateElement.firstElementChild.outerHTML;

    replyMessageTemplate = replyMessageTemplate
      .replaceAll("{{CHAT_REPLY_TO_PRESENT}}", true)
      .replaceAll("{{CHAT_REPLY_TO_USERNAME}}", current_user.id == chat.reply_to.user_id ? 'You' : chat.reply_to.user.username)
      .replaceAll("{{CHAT_REPLY_TO_MESSAGE}}", chat.reply_to.message)
  }

  constructSeenStatus(chat, current_user) { 
    let seenStatusTemplateElement = document.querySelector('[data-chat-target="chat_seen_status_template"]').content.cloneNode(true);
    let seenStatusTemplate = seenStatusTemplateElement.firstElementChild.outerHTML;

    const date = new Date(chat.created_at);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    seenStatusTemplate = seenStatusTemplate
      .replace("{{CHAT_ALL_READ}}", chat.all_read)
      .replace("{{CHAT_CREATED_AT}}", `${hours}:${minutes}`)
    
    return seenStatusTemplate;
  }
}
