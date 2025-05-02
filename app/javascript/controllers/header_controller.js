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
}
