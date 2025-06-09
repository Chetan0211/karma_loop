import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="header"
export default class extends Controller {
  connect() {
    let menuButton = document.getElementById('mobile-menu-button');
    let mobileMenu = document.getElementById('mobile-menu');
    let mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    let closeButton = document.getElementById('mobile-menu-close-button'); // Get the close button inside the menu

    // Event listener for the hamburger button
    menuButton.addEventListener('click', () => {
      let isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        mobileMenu.classList.add('translate-x-full'); // Slide out
        mobileMenuOverlay.classList.add('hidden'); // Hide overlay
        document.body.classList.remove('overflow-hidden'); // Allow body scroll
        menuButton.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.remove('translate-x-full'); // Slide in
        mobileMenuOverlay.classList.remove('hidden'); // Show overlay
        document.body.classList.add('overflow-hidden'); // Prevent body scroll
        menuButton.setAttribute('aria-expanded', 'true');
      }
    });

  // Event listener for the close button inside the menu
    closeButton.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full'); // Slide out
      mobileMenuOverlay.classList.add('hidden'); // Hide overlay
      document.body.classList.remove('overflow-hidden'); // Allow body scroll
      menuButton.setAttribute('aria-expanded', 'false');
    });

    // Event listener for the overlay (closes menu when clicked)
    mobileMenuOverlay.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full'); // Slide out
      mobileMenuOverlay.classList.add('hidden'); // Hide overlay
      document.body.classList.remove('overflow-hidden'); // Allow body scroll
      menuButton.setAttribute('aria-expanded', 'false');
    });
  }

  seachOnChange(event) {
    const query = event.target.value
    const urlTemplate = event.target.dataset.searchUrlTemplate

    console.log("urlTemplate: ", urlTemplate);
    // Replace the placeholder with the actual, URI-encoded query
    const url = urlTemplate.replace('PLACEHOLDER', encodeURIComponent(query))

    // Use Turbo.visit to fetch the results and update the frame
    Turbo.visit(url, { frame: 'search_results' })
  }
}
