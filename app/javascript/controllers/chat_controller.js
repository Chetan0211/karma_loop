import { Controller } from "@hotwired/stimulus"
import { format, isToday, isYesterday } from 'date-fns'

// Connects to data-controller="chat"
export default class extends Controller {
  connect() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // For every node that was added...
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.matches('.chat-message')) {
            this.checkDateSeperatorOnMessage(node);
            this.scrollToBottom();
          }
        })
      })
    });

    let group = this.element.dataset.groupId;
    let chat_list = document.querySelector(`#chat_list_${group}`);
    let scroll_area = document.querySelector("#chat_scroll_area");
    scroll_area.scrollTop = scroll_area.scrollHeight;

    this.observer.observe(chat_list, { childList: true });
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
    let message_element = chat_form.querySelector("#new_chat_message");
    let message = message_element.value;
    let temp_chat_id_element = chat_form.querySelector("#new_chat_temporary_chat_id");
    let templateElement = document.querySelector('[data-chat-form-target="chat_sent_template"]').content.cloneNode(true);
    let newTemplate = templateElement.firstElementChild.outerHTML;
    let group_id = chat_form.dataset.groupId;
    let temp_id = `${group_id}_temp_chat_id_${Date.now()}`; 
    temp_chat_id_element.value = temp_id;
    let now = new Date();
    newTemplate = newTemplate
      .replace("{{CHAT_ID}}", temp_id)
      .replace("{{MESSAGE}}", message)
      .replace("{{DATE}}", now.toISOString().slice(0, 10))
      .replace("{{MESSAGE_TIME}}", `${now.getHours()}:${now.getMinutes()}`);
    
    //Send request to server by submitting the request
    chat_form.requestSubmit();

    let chat_list = document.querySelector(`#chat_list_${group_id}`);

    //Append the date seperator if not exists
    this.appendDate(chat_list);

    
    if(chat_list.querySelector(`#empty_chat_window_${group_id}`)) {
      chat_list.querySelector(`#empty_chat_window_${group_id}`).remove();
    }
    chat_list.insertAdjacentHTML("beforeend", newTemplate);
    message_element.value = "";
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
}
