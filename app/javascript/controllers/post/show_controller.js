import { Controller } from "@hotwired/stimulus"
import { parentCommentToggle, parentLikeToggle } from "../../helpers/post_helper";

// Connects to data-controller="post--show"
export default class extends Controller {
  connect() {
    parentCommentToggle();
    parentLikeToggle();
  }
}
