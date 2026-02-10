/**
 * ThriftHotels.com - Interactive Features
 * Mobile-first JavaScript for enhanced user experience
 */

(function() {
    'use strict';

    // ==============================================
    // MOBILE NAVIGATION TOGGLE
    // ==============================================

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        // Toggle mobile menu
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = navMenu.contains(event.target) || navToggle.contains(event.target);

            if (!isClickInside && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ==============================================
    // HEADER SCROLL EFFECT
    // ==============================================

    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // ==============================================
    // BACK TO TOP BUTTON
    // ==============================================

    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Only prevent default for actual anchor links (not just "#")
            if (href !== '#' && href !== '') {
                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==============================================
    // INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
    // ==============================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections for fade-in effect
    const animatedElements = document.querySelectorAll('.stat-card, .score-card, .city-card, .collection-card, .strategy-card, .process-step, .comparison-card, .evidence-card, .ranking-card, .audience-card');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ==============================================
    // LAZY LOADING FOR IMAGES
    // ==============================================

    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ==============================================
    // TOUCH GESTURES FOR MOBILE
    // ==============================================

    let touchStartX = 0;
    let touchEndX = 0;

    // Swipe to close mobile menu
    if (navMenu) {
        navMenu.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        navMenu.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            // Swipe left to close menu
            if (touchEndX < touchStartX - 50) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }

    // ==============================================
    // PERFORMANCE: DEBOUNCE SCROLL EVENTS
    // ==============================================

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ==============================================
    // ANALYTICS: TRACK OUTBOUND LINKS
    // ==============================================

    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="thrifthotels.com"])');

    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Placeholder for analytics tracking
            console.log('External link clicked:', this.href);
        });
    });

    // ==============================================
    // ACCESSIBILITY: KEYBOARD NAVIGATION
    // ==============================================

    // Trap focus in mobile menu when open
    if (navMenu) {
        const focusableElements = navMenu.querySelectorAll('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }

            // Close menu on Escape key
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                navToggle.focus();
            }
        });
    }

    // ==============================================
    // DYNAMIC YEAR IN FOOTER
    // ==============================================

    const currentYear = new Date().getFullYear();
    const copyrightText = document.querySelector('.footer-copyright');
    if (copyrightText) {
        copyrightText.textContent = `© ${currentYear} ThriftHotels.com. All rights reserved.`;
    }

    // ==============================================
    // PRELOAD CRITICAL RESOURCES
    // ==============================================

    function preloadResources() {
        const criticalPages = ['cities.html', 'hotels.html', 'rankings.html'];

        criticalPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    }

    // Preload after page load
    if (document.readyState === 'complete') {
        preloadResources();
    } else {
        window.addEventListener('load', preloadResources);
    }

    // ==============================================
    // SERVICE WORKER REGISTRATION (PWA Support)
    // ==============================================

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // Placeholder for service worker registration
            // navigator.serviceWorker.register('/sw.js')
            //     .then(reg => console.log('Service Worker registered'))
            //     .catch(err => console.log('Service Worker registration failed'));
        });
    }

    // ==============================================
    // VIEWPORT HEIGHT FIX FOR MOBILE BROWSERS
    // ==============================================

    function setViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setViewportHeight();
    window.addEventListener('resize', debounce(setViewportHeight, 200));

    // ==============================================
    // DETECT TOUCH DEVICE
    // ==============================================

    function isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }

    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('no-touch');
    }

    // ==============================================
    // PREVENT ZOOM ON DOUBLE TAP (iOS)
    // ==============================================

    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });

    // ==============================================
    // CONSOLE WELCOME MESSAGE
    // ==============================================

    console.log('%c⭐ ThriftHotels.com', 'font-size: 24px; font-weight: bold; color: #667eea;');
    console.log('%cCheapest Hotels That Are Still Quality', 'font-size: 14px; color: #764ba2;');
    console.log('%cBuilt with ❤️ for budget travelers worldwide', 'font-size: 12px; color: #4a5568;');

    // ==============================================
    // INITIALIZE ON DOM READY
    // ==============================================

    console.log('✓ ThriftHotels.com initialized successfully');

})();
