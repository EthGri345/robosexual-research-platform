/**
 * ROBOSEXUALITY RESEARCH PLATFORM - MAIN APPLICATION
 * Enterprise-grade JavaScript architecture with ES6 modules
 * Performance-optimized with lazy loading and efficient DOM manipulation
 */

// ============================================================================
// CORE APPLICATION CLASS
// ============================================================================

class RobosexualityApp {
  constructor() {
    this.isInitialized = false;
    this.observers = new Map();
    this.modules = new Map();
    this.state = {
      currentSection: 'home',
      genderVersion: 'male', // 'male' or 'female'
      animationPlaying: false,
      scrollPosition: 0,
      isMenuOpen: false
    };
    
    this.config = {
      scrollThreshold: 100,
      animationDuration: 300,
      debounceDelay: 16,
      intersectionThreshold: 0.1
    };

    this.init();
  }

  async init() {
    if (this.isInitialized) return;

    try {
      // Initialize core modules
      await this.initializeModules();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize intersection observers
      this.setupIntersectionObservers();
      
      // Initialize animations
      this.initializeAnimations();
      
      // Set up performance optimizations
      this.setupPerformanceOptimizations();
      
      this.isInitialized = true;
      console.log('🤖 Robosexuality Research Platform initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize application:', error);
    }
  }

  async initializeModules() {
    // Navigation Module
    this.modules.set('navigation', new NavigationModule(this));
    
    // Scroll Module
    this.modules.set('scroll', new ScrollModule(this));
    
    // Animation Module
    this.modules.set('animation', new AnimationModule(this));
    
    // Form Module
    this.modules.set('form', new FormModule(this));
    
    // Analytics Module (placeholder)
    this.modules.set('analytics', new AnalyticsModule(this));
  }

  setupEventListeners() {
    // Throttled scroll handler
    const throttledScrollHandler = this.throttle(
      () => this.handleScroll(), 
      this.config.debounceDelay
    );
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Throttled resize handler
    const throttledResizeHandler = this.throttle(
      () => this.handleResize(), 
      100
    );
    
    window.addEventListener('resize', throttledResizeHandler, { passive: true });
    
    // Handle visibility change for performance
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    
    // Handle page focus/blur
    window.addEventListener('focus', () => this.handleFocus());
    window.addEventListener('blur', () => this.handleBlur());
  }

  setupIntersectionObservers() {
    // Observer for sections
    const sectionObserver = new IntersectionObserver(
      (entries) => this.handleSectionIntersection(entries),
      {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    document.querySelectorAll('section[id]').forEach(section => {
      sectionObserver.observe(section);
    });

    // Observer for animations
    const animationObserver = new IntersectionObserver(
      (entries) => this.handleAnimationIntersection(entries),
      {
        threshold: this.config.intersectionThreshold,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    document.querySelectorAll('.timeline__item, .story-card, .prediction-card, .finding-card').forEach(el => {
      animationObserver.observe(el);
    });

    this.observers.set('sections', sectionObserver);
    this.observers.set('animations', animationObserver);
  }

  initializeAnimations() {
    // Initialize hero animations
    this.animateHero();
    
    // Initialize particles
    this.initializeParticles();
    
    // Animate statistics
    this.animateStatistics();
  }

  setupPerformanceOptimizations() {
    // Add GPU acceleration hints
    const elementsToAccelerate = document.querySelectorAll(
      '.hero, .nav__list, .story-card, .prediction-card'
    );
    
    elementsToAccelerate.forEach(el => {
      el.style.willChange = 'transform';
      el.style.backfaceVisibility = 'hidden';
    });

    // Lazy load images when implemented
    this.setupLazyLoading();
  }

  // Event Handlers
  handleScroll() {
    const scrollY = window.pageYOffset;
    this.state.scrollPosition = scrollY;
    
    // Update header background
    const header = document.querySelector('.header');
    if (scrollY > this.config.scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    // Parallax effect for hero
    this.handleParallax(scrollY);
  }

  handleResize() {
    // Recalculate layout
    this.modules.get('navigation')?.handleResize();
    
    // Update particle system
    this.updateParticles();
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, pause animations
      this.pauseAnimations();
    } else {
      // Page is visible, resume animations
      this.resumeAnimations();
    }
  }

  handleFocus() {
    // Resume any paused animations
    this.resumeAnimations();
  }

  handleBlur() {
    // Pause non-critical animations
    this.pauseAnimations();
  }

  handleSectionIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        this.state.currentSection = sectionId;
        this.modules.get('navigation')?.updateActiveLink(sectionId);
        this.modules.get('analytics')?.trackSectionView(sectionId);
      }
    });
  }

  handleAnimationIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up--visible');
        
        // Add specific visibility classes
        if (entry.target.classList.contains('timeline__item')) {
          entry.target.classList.add('timeline__item--visible');
        }
        if (entry.target.classList.contains('story-card')) {
          entry.target.classList.add('story-card--visible');
        }
        if (entry.target.classList.contains('prediction-card')) {
          entry.target.classList.add('prediction-card--visible');
        }
      }
    });
  }

  handleParallax(scrollY) {
    const hero = document.querySelector('.hero');
    if (hero) {
      const parallaxSpeed = 0.5;
      hero.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
    }
  }

  // Animation Methods
  animateHero() {
    // Hero title animation is handled by CSS, but we can trigger it
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
      heroTitle.style.opacity = '0';
      
      requestAnimationFrame(() => {
        heroTitle.style.opacity = '1';
        heroTitle.style.transition = 'opacity 0.5s ease-out';
      });
    }
  }

  initializeParticles() {
    const canvas = document.querySelector('.hero__particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#00FFFF';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      this.drawConnections(ctx, particles);
      
      animationId = requestAnimationFrame(animate);
    };

    animate();
    
    // Store animation ID for cleanup
    this.particleAnimationId = animationId;
  }

  drawConnections(ctx, particles) {
    const maxDistance = 100;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (maxDistance - distance) / maxDistance * 0.2;
          
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = '#00FFFF';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  updateParticles() {
    // Reinitialize particles on resize
    if (this.particleAnimationId) {
      cancelAnimationFrame(this.particleAnimationId);
      this.initializeParticles();
    }
  }

  animateStatistics() {
    const stats = document.querySelectorAll('.stat__number');
    
    stats.forEach(stat => {
      const target = parseInt(stat.dataset.target);
      const duration = 2000;
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);
        
        stat.textContent = current;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          stat.textContent = target;
        }
      };
      
      // Start animation when visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            requestAnimationFrame(animate);
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(stat);
    });
  }

  pauseAnimations() {
    if (this.particleAnimationId) {
      cancelAnimationFrame(this.particleAnimationId);
    }
  }

  resumeAnimations() {
    if (!this.particleAnimationId) {
      this.initializeParticles();
    }
  }

  setupLazyLoading() {
    // Placeholder for future image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length && 'IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  // Utility Methods
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Public API
  getState() {
    return { ...this.state };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  getModule(name) {
    return this.modules.get(name);
  }
}

// ============================================================================
// NAVIGATION MODULE
// ============================================================================

class NavigationModule {
  constructor(app) {
    this.app = app;
    this.elements = {
      toggle: document.getElementById('nav-toggle'),
      menu: document.getElementById('nav-menu'),
      links: document.querySelectorAll('.nav__link'),
      genderToggle: document.getElementById('gender-toggle'),
      toggleLabel: document.querySelector('.toggle-switch__label')
    };
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupAccessibility();
  }

  bindEvents() {
    // Mobile menu toggle
    this.elements.toggle?.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });

    // Navigation links
    this.elements.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNavClick(link);
      });
    });

    // Gender toggle
    this.elements.genderToggle?.addEventListener('click', () => {
      this.toggleGenderVersion();
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav') && this.app.state.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.app.state.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  setupAccessibility() {
    // Ensure proper ARIA attributes are set
    if (this.elements.toggle) {
      this.elements.toggle.setAttribute('aria-expanded', 'false');
    }

    // Add keyboard navigation for links
    this.elements.links.forEach(link => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });
  }

  toggleMobileMenu() {
    const isOpen = !this.app.state.isMenuOpen;
    this.app.setState({ isMenuOpen: isOpen });

    this.elements.menu?.classList.toggle('nav__list--active', isOpen);
    this.elements.toggle?.setAttribute('aria-expanded', isOpen.toString());

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    if (this.app.state.isMenuOpen) {
      this.app.setState({ isMenuOpen: false });
      this.elements.menu?.classList.remove('nav__list--active');
      this.elements.toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  handleNavClick(link) {
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      this.scrollToSection(targetElement);
      this.closeMobileMenu();
      
      // Update active state
      this.updateActiveLink(targetId);
      
      // Track navigation
      this.app.getModule('analytics')?.trackNavigation(targetId);
    }
  }

  scrollToSection(element) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = element.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  updateActiveLink(sectionId) {
    this.elements.links.forEach(link => {
      const isActive = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('nav__link--active', isActive);
    });
  }

  toggleGenderVersion() {
    const newVersion = this.app.state.genderVersion === 'male' ? 'female' : 'male';
    this.app.setState({ genderVersion: newVersion });

    // Update toggle switch
    const toggleSwitch = document.querySelector('.toggle-switch');
    const isChecked = newVersion === 'female';
    
    toggleSwitch?.setAttribute('aria-checked', isChecked.toString());
    
    if (this.elements.toggleLabel) {
      this.elements.toggleLabel.textContent = isChecked ? 
        'Switch to Male Version' : 'Switch to Female Version';
    }

    // Update animation system
    this.app.getModule('animation')?.updateGenderVersion(newVersion);
    
    // Track toggle
    this.app.getModule('analytics')?.trackGenderToggle(newVersion);
  }

  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && this.app.state.isMenuOpen) {
      this.closeMobileMenu();
    }
  }
}

// ============================================================================
// SCROLL MODULE
// ============================================================================

class ScrollModule {
  constructor(app) {
    this.app = app;
    this.init();
  }

  init() {
    this.setupScrollIndicator();
    this.setupSmoothScrolling();
  }

  setupScrollIndicator() {
    const scrollButton = document.querySelector('.scroll-indicator');
    
    scrollButton?.addEventListener('click', () => {
      const firstSection = document.getElementById('history');
      if (firstSection) {
        this.app.getModule('navigation').scrollToSection(firstSection);
      }
    });
  }

  setupSmoothScrolling() {
    // Enhanced smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          this.app.getModule('navigation').scrollToSection(target);
        }
      });
    });
  }
}

// ============================================================================
// ANIMATION MODULE
// ============================================================================

class AnimationModule {
  constructor(app) {
    this.app = app;
    this.currentFrame = 1;
    this.isPlaying = false;
    this.animationInterval = null;
    
    this.init();
  }

  init() {
    this.bindControls();
    this.setupFrames();
  }

  bindControls() {
    const playButton = document.getElementById('animation-play');
    const pauseButton = document.getElementById('animation-pause');

    playButton?.addEventListener('click', () => this.playAnimation());
    pauseButton?.addEventListener('click', () => this.pauseAnimation());
  }

  setupFrames() {
    const frames = document.querySelectorAll('.frame');
    frames.forEach((frame, index) => {
      frame.addEventListener('click', () => {
        this.showFrame(index + 1);
      });
    });
  }

  playAnimation() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.app.setState({ animationPlaying: true });

    const playButton = document.getElementById('animation-play');
    const pauseButton = document.getElementById('animation-pause');

    playButton.disabled = true;
    pauseButton.disabled = false;

    this.animationInterval = setInterval(() => {
      this.nextFrame();
    }, 1000);

    // Track animation play
    this.app.getModule('analytics')?.trackAnimationPlay();
  }

  pauseAnimation() {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    this.app.setState({ animationPlaying: false });

    const playButton = document.getElementById('animation-play');
    const pauseButton = document.getElementById('animation-pause');

    playButton.disabled = false;
    pauseButton.disabled = true;

    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

    // Track animation pause
    this.app.getModule('analytics')?.trackAnimationPause();
  }

  showFrame(frameNumber) {
    const frames = document.querySelectorAll('.frame');
    
    frames.forEach((frame, index) => {
      frame.classList.toggle('frame--active', index + 1 === frameNumber);
    });

    this.currentFrame = frameNumber;
    this.updateFrameContent();
  }

  nextFrame() {
    const totalFrames = document.querySelectorAll('.frame').length;
    this.currentFrame = this.currentFrame >= totalFrames ? 1 : this.currentFrame + 1;
    this.showFrame(this.currentFrame);
  }

  updateFrameContent() {
    const frames = document.querySelectorAll('.frame-placeholder');
    const genderVersion = this.app.state.genderVersion;
    
    frames.forEach((placeholder, index) => {
      const frameNumber = index + 1;
      const state = frameNumber === this.currentFrame ? 'Active' : 'Inactive';
      const version = genderVersion === 'female' ? 'Female' : 'Male';
      
      placeholder.textContent = `Frame ${frameNumber}: ${state} State (${version} Version)`;
    });
  }

  updateGenderVersion(version) {
    this.updateFrameContent();
    
    // Update animation placeholder content
    const placeholderContent = document.querySelector('.placeholder-content p');
    if (placeholderContent) {
      placeholderContent.textContent = `Educational visualization system would be implemented here (${version.charAt(0).toUpperCase() + version.slice(1)} Version)`;
    }
  }
}

// ============================================================================
// FORM MODULE
// ============================================================================

class FormModule {
  constructor(app) {
    this.app = app;
    this.form = document.getElementById('contact-form');
    this.validators = new Map();
    
    this.init();
  }

  init() {
    if (!this.form) return;

    this.setupValidators();
    this.bindEvents();
    this.setupAccessibility();
  }

  setupValidators() {
    this.validators.set('name', {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Name must contain only letters and spaces, minimum 2 characters'
    });

    this.validators.set('email', {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    });

    this.validators.set('subject', {
      required: true,
      message: 'Please select a research area'
    });

    this.validators.set('message', {
      required: true,
      minLength: 10,
      maxLength: 1000,
      message: 'Message must be between 10 and 1000 characters'
    });
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time validation
    this.form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearFieldError(field));
    });
  }

  setupAccessibility() {
    // Associate error messages with fields
    this.form.querySelectorAll('[aria-describedby]').forEach(field => {
      const errorId = field.getAttribute('aria-describedby');
      const errorElement = document.getElementById(errorId);
      
      if (errorElement) {
        errorElement.setAttribute('role', 'alert');
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const isValid = this.validateForm();
    if (!isValid) return;

    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.querySelector('.btn__text').textContent;

    try {
      // Show loading state
      this.setSubmitState('loading');

      // Simulate form submission
      await this.submitForm();

      // Show success state
      this.setSubmitState('success');
      this.form.reset();
      
      // Track successful submission
      this.app.getModule('analytics')?.trackFormSubmission('contact', 'success');

      // Reset button after delay
      setTimeout(() => {
        this.setSubmitState('default');
      }, 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      
      // Show error state
      this.setSubmitState('error');
      
      // Track failed submission
      this.app.getModule('analytics')?.trackFormSubmission('contact', 'error');

      // Reset button after delay
      setTimeout(() => {
        this.setSubmitState('default');
      }, 3000);
    }
  }

  async submitForm() {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure
        if (Math.random() > 0.1) { // 90% success rate
          resolve({ success: true });
        } else {
          reject(new Error('Submission failed'));
        }
      }, 2000);
    });
  }

  validateForm() {
    let isValid = true;
    const fields = this.form.querySelectorAll('[name]');

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const fieldName = field.name;
    const validator = this.validators.get(fieldName);
    
    if (!validator) return true;

    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (validator.required && !value) {
      isValid = false;
      errorMessage = `${this.capitalize(fieldName)} is required`;
    }

    // Pattern validation
    else if (value && validator.pattern && !validator.pattern.test(value)) {
      isValid = false;
      errorMessage = validator.message;
    }

    // Length validation
    else if (value && validator.minLength && value.length < validator.minLength) {
      isValid = false;
      errorMessage = validator.message;
    }

    else if (value && validator.maxLength && value.length > validator.maxLength) {
      isValid = false;
      errorMessage = validator.message;
    }

    // Update field state
    this.updateFieldState(field, isValid, errorMessage);
    
    return isValid;
  }

  updateFieldState(field, isValid, errorMessage) {
    const errorElement = document.getElementById(`${field.name}-error`);
    
    field.classList.toggle('field-error', !isValid);
    field.setAttribute('aria-invalid', (!isValid).toString());
    
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.style.display = errorMessage ? 'block' : 'none';
    }
  }

  clearFieldError(field) {
    field.classList.remove('field-error');
    field.setAttribute('aria-invalid', 'false');
    
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  setSubmitState(state) {
    const button = this.form.querySelector('button[type="submit"]');
    const textElement = button.querySelector('.btn__text');
    const loader = button.querySelector('.btn__loader');

    button.classList.remove('btn--loading', 'btn--success', 'btn--error');

    switch (state) {
      case 'loading':
        button.classList.add('btn--loading');
        button.disabled = true;
        textElement.textContent = 'Submitting...';
        break;
        
      case 'success':
        button.classList.add('btn--success');
        button.disabled = true;
        textElement.textContent = 'Message Sent!';
        break;
        
      case 'error':
        button.classList.add('btn--error');
        button.disabled = false;
        textElement.textContent = 'Failed - Try Again';
        break;
        
      case 'default':
        button.disabled = false;
        textElement.textContent = 'Submit Inquiry';
        break;
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// ============================================================================
// ANALYTICS MODULE
// ============================================================================

class AnalyticsModule {
  constructor(app) {
    this.app = app;
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    
    this.init();
  }

  init() {
    this.trackPageView();
    this.setupPerformanceTracking();
    this.setupErrorTracking();
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  trackEvent(category, action, label = '', value = 0) {
    const event = {
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };

    this.events.push(event);
    
    // In a real application, you would send this to your analytics service
    console.log('📊 Analytics Event:', event);
  }

  trackPageView() {
    this.trackEvent('Page', 'View', document.title);
  }

  trackSectionView(sectionId) {
    this.trackEvent('Section', 'View', sectionId);
  }

  trackNavigation(targetId) {
    this.trackEvent('Navigation', 'Click', targetId);
  }

  trackGenderToggle(version) {
    this.trackEvent('Interaction', 'Gender Toggle', version);
  }

  trackAnimationPlay() {
    this.trackEvent('Animation', 'Play', 'Educational Simulation');
  }

  trackAnimationPause() {
    this.trackEvent('Animation', 'Pause', 'Educational Simulation');
  }

  trackFormSubmission(formName, result) {
    this.trackEvent('Form', 'Submit', formName, result === 'success' ? 1 : 0);
  }

  setupPerformanceTracking() {
    // Track page load performance
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        this.trackEvent('Performance', 'Page Load Time', '', loadTime);
      }
    });

    // Track Core Web Vitals if available
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              this.trackEvent('Performance', 'LCP', '', Math.round(entry.startTime));
            }
            if (entry.entryType === 'first-input') {
              this.trackEvent('Performance', 'FID', '', Math.round(entry.processingStart - entry.startTime));
            }
          }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
      } catch (error) {
        console.warn('Performance observer not supported:', error);
      }
    }
  }

  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.trackEvent('Error', 'JavaScript Error', event.message, 1);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('Error', 'Promise Rejection', event.reason, 1);
    });
  }

  getSessionData() {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      duration: Date.now() - this.startTime,
      events: this.events
    };
  }
}

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  // Remove no-js class
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  // Initialize main application
  window.robosexualityApp = new RobosexualityApp();
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RobosexualityApp,
    NavigationModule,
    ScrollModule,
    AnimationModule,
    FormModule,
    AnalyticsModule
  };
}