import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="header"
export default class extends Controller {
  connect() {
  }

  seachOnChange(event) {
    const query = event.target.value
    const urlTemplate = event.target.dataset.searchUrlTemplate

    // console.log("urlTemplate: ", urlTemplate);
    // Replace the placeholder with the actual, URI-encoded query
    const url = urlTemplate.replace('PLACEHOLDER', encodeURIComponent(query))

    // Use Turbo.visit to fetch the results and update the frame
    fetch(url, { method: 'GET', headers: { 'Accept': 'text/vnd.turbo-stream.html' } })
      .then(response => response.text())
      .then(html => {
      Turbo.renderStreamMessage(html)
    })
  }
}
