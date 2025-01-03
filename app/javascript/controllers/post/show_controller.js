import { Controller } from "@hotwired/stimulus"
import { parentCommentToggle } from "../../helpers/comment";

// Connects to data-controller="post--show"
export default class extends Controller {
  connect() {
    parentCommentToggle();
  }
}
