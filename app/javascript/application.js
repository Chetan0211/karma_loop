// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

import "trix"
import "@rails/actiontext"
import * as ActiveStorage from "@rails/activestorage";
ActiveStorage.start();

import 'alpine-turbo-drive-adapter'
import Alpine from 'alpinejs'

window.Alpine = Alpine
Alpine.start()

import shaka from 'shaka-player';

function initializeVideoPlayer() {
  shaka.polyfill.installAll();
  let videoObserver = videoInteractionObserver();
  let players = document.querySelectorAll(".video-player");
  players.forEach((shakaContainer) => {
    if (shakaContainer.querySelector("video")) {
      return;
    }
    let source = shakaContainer.dataset.hlsUrl;
    if (shaka.Player.isBrowserSupported()) { 
      let splayer = new shaka.Player();
      let videoElement = document.createElement("video");
      videoObserver.observe(videoElement);
      videoElement.class = "w-full h-full object-contain";
      videoElement.poster = '/loading.svg';
      videoElement.onerror = function() {
        this.poster = 'https://placehold.co/1280x720/f87171/ffffff?text=Video+Error';
        this.controls = false;
      };
      videoElement.textContent = 'Your browser does not support the video tag.';
      videoElement.autoplay = true;
      videoElement.muted = true;
      shakaContainer.appendChild(videoElement);

      let ui = new shaka.ui.Overlay(splayer, shakaContainer, videoElement);
      ui.configure({
        controlPanelElements: [
          'play_pause',
          'time_and_duration',
          'spacer',
          'mute',
          'overflow_menu'
        ],
        overflowMenuButtons: [
          'quality',
          'playback_rate'
          // 'captions', // Explicitly commented out
          // 'language', // Explicitly commented out
          // 'loop',
          // 'picture_in_picture' // Explicitly commented out
        ],
        seekBarColors: {
          base: 'rgba(255, 255, 255, 0.3)',
          buffered: 'rgba(255, 255, 255, 0.54)',
          played: 'rgba(168, 85, 247, 1)'
        }
        // Add other UI specific configurations here if needed
      });
      splayer.attach(videoElement).then(() => { 
        return splayer.load(source);
      });
    }
  })
}

function videoInteractionObserver() {
  const playVideoOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        // Video is in view
        video.play();
      } else {
        // Video is out of view
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }
  const observerOptions = {
    root: null, // relative to document viewport
    rootMargin: '0px', // no margin
    threshold: 0.80 // 0.5 means 50% of the element must be visible. Adjust this value as needed (0.0 to 1.0)
  };
  const videoObserver = new IntersectionObserver(playVideoOnScroll, observerOptions);
  return videoObserver;
}

// function getThemeMode() {
//   const theme = localStorage.getItem('dark_mode');
//   const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
//   if (theme === 'dark' || (!theme && prefersDark)) {
//     document.documentElement.classList.add('dark');
//     document.documentElement.classList.remove('light');
//   }
//   else {
//     document.documentElement.classList.add('light');
//     document.documentElement.classList.remove('dark');
//   }

//   const siteTheme = localStorage.getItem('site_theme');
//   if (siteTheme) {
//     document.documentElement.classList.add(siteTheme);
//   }
//   else {
//     document.documentElement.classList.add('purple');
//   }
// }

// document.addEventListener('DOMContentLoaded', getThemeMode);

document.addEventListener('turbo:load', initializeVideoPlayer);import "./channels"
