import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="password-visibility"
export default class extends Controller {
  static targets = ["input", "icon"]

  toggle(event) {
    const hidden = this.inputTarget.type === "password"
    this.inputTarget.type = hidden ? "text" : "password"
    this.iconTarget.classList.toggle("fa-eye", !hidden)
    this.iconTarget.classList.toggle("fa-eye-slash", hidden)
    event.currentTarget.setAttribute("aria-label", hidden ? "Hide password" : "Show password")
  }
}
