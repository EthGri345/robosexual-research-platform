/**
 * FALLBACK SCRIPT FOR OLDER BROWSERS
 * Provides basic functionality for browsers that don't support ES6 modules
 */

(function() {
  'use strict';

  // Check for basic browser support
  if (!document.querySelector || !window.addEventListener) {
    console.warn('Browser not fully supported. Some features may not work.');
    return;
  }

  // Basic polyfills
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback) {
      for (var i = 0; i < this.length; i++) {
        callback.call(this, this[i], i, this);
      }
    };
  }

  // Simple throttle function
  function throttle(func, limit) {
    var inThrottle;
    return function() {
      var args = arguments;
      var context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() { inThrottle = false; }, limit);
      }
    };
  }

  // Basic navigation functionality
  function initNavigation() {
    var navToggle = document.getElementById('nav-toggle');
    var navMenu = document.getElementById('nav-menu');
    var navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        var isOpen = navMenu.classList.contains('nav__list--active');
        
        if (isOpen) {
          navMenu.classList.remove('nav__list--active');
          navToggle.setAttribute('aria-expanded', 'false');
        } else {
          navMenu.classList.add('nav__list--active');
          navToggle.setAttribute('aria-expanded', 'true');
        }
      });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var targetId = this.getAttribute('href').substring(1);
        var targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          var headerHeight = document.querySelector('.header').offsetHeight || 80;
          var targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          // Close mobile menu
          if (navMenu) {
            navMenu.classList.remove('nav__list--active');
          }
          if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
          }
          
          // Smooth scroll fallback
          if (window.scrollTo) {
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          } else {
            window.scrollTop = targetPosition;
          }
        }
      });
    });
  }

  // Basic scroll handling
  function initScroll() {
    var header = document.querySelector('.header');
    
    var handleScroll = throttle(function() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      if (header) {
        if (scrollY > 100) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }
      }
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Basic form handling
  function initForm() {
    var contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var submitButton = contactForm.querySelector('button[type="submit"]');
      var buttonText = submitButton.querySelector('.btn__text');
      
      if (buttonText) {
        var originalText = buttonText.textContent;
        buttonText.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        // Simulate submission
        setTimeout(function() {
          buttonText.textContent = 'Message Sent!';
          contactForm.reset();
          
          setTimeout(function() {
            buttonText.textContent = originalText;
            submitButton.disabled = false;
          }, 2000);
        }, 1000);
      }
    });
  }

  // Basic gender toggle
  function initToggle() {
    var genderToggle = document.getElementById('gender-toggle');
    var toggleLabel = document.querySelector('.toggle-switch__label');
    var toggleSwitch = document.querySelector('.toggle-switch');
    
    if (genderToggle && toggleLabel && toggleSwitch) {
      genderToggle.addEventListener('click', function() {
        var isChecked = toggleSwitch.getAttribute('aria-checked') === 'true';
        var newState = !isChecked;
        
        toggleSwitch.setAttribute('aria-checked', newState.toString());
        toggleLabel.textContent = newState ? 
          'Switch to Male Version' : 'Switch to Female Version';
      });
    }
  }

  // Basic animation controls
  function initAnimation() {
    var playButton = document.getElementById('animation-play');
    var pauseButton = document.getElementById('animation-pause');
    var frames = document.querySelectorAll('.frame');
    var currentFrame = 1;
    var animationInterval;

    if (playButton && pauseButton && frames.length > 0) {
      playButton.addEventListener('click', function() {
        playButton.disabled = true;
        pauseButton.disabled = false;
        
        animationInterval = setInterval(function() {
          frames.forEach(function(frame, index) {
            frame.classList.toggle('frame--active', index + 1 === currentFrame);
          });
          
          currentFrame = currentFrame >= frames.length ? 1 : currentFrame + 1;
        }, 1000);
      });

      pauseButton.addEventListener('click', function() {
        playButton.disabled = false;
        pauseButton.disabled = true;
        
        if (animationInterval) {
          clearInterval(animationInterval);
        }
      });
    }
  }

  // Initialize everything when DOM is ready
  function init() {
    // Remove no-js class
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js', 'fallback');
    
    // Initialize modules
    initNavigation();
    initScroll();
    initForm();
    initToggle();
    initAnimation();
    
    console.log('🔧 Fallback functionality initialized');
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();