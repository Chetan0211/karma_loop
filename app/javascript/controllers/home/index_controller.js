import { Controller } from "@hotwired/stimulus"
import {parentLikeToggle} from "../../helpers/post_helper";

// Connects to data-controller="home--index"
export default class extends Controller {
  connect() {
    parentLikeToggle();
  }
}
