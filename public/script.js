// ========================================
// VIVA PONTA DE PEDRAS - JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initTabs();
    initCarousel();
    initScrollAnimations();
    initSmoothScroll();
});

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    var nav = document.getElementById('nav');
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    
    // Scroll behavior
    window.addEventListener('scroll', function() {
        var currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    var menuLinks = navMenu.querySelectorAll('a');
    for (var i = 0; i < menuLinks.length; i++) {
        menuLinks[i].addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu on outside click
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// TABS
// ========================================
function initTabs() {
    var tabButtons = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');
    
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].addEventListener('click', function() {
            var targetTab = this.getAttribute('data-tab');
            
            // Remove active from all buttons and contents
            for (var j = 0; j < tabButtons.length; j++) {
                tabButtons[j].classList.remove('active');
            }
            for (var k = 0; k < tabContents.length; k++) {
                tabContents[k].classList.remove('active');
            }
            
            // Add active to clicked button and target content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    }
}

// ========================================
// CAROUSEL
// ========================================
function initCarousel() {
    var track = document.getElementById('carouselTrack');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    var cards = track.querySelectorAll('.gastro-card');
    var currentIndex = 0;
    var cardWidth = 0;
    var visibleCards = 3;
    
    function updateCarousel() {
        // Calculate visible cards based on screen size
        if (window.innerWidth <= 480) {
            visibleCards = 1;
        } else if (window.innerWidth <= 768) {
            visibleCards = 1;
        } else if (window.innerWidth <= 1024) {
            visibleCards = 2;
        } else {
            visibleCards = 3;
        }
        
        cardWidth = track.parentElement.offsetWidth / visibleCards;
        
        // Update card widths
        for (var i = 0; i < cards.length; i++) {
            cards[i].style.flex = '0 0 ' + (cardWidth - 24) + 'px';
        }
        
        // Move track
        track.style.transform = 'translateX(-' + (currentIndex * cardWidth) + 'px)';
    }
    
    function goToNext() {
        var maxIndex = cards.length - visibleCards;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    }
    
    function goToPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }
    
    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);
    
    // Initialize
    updateCarousel();
    
    // Resize handler
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            currentIndex = 0;
            updateCarousel();
        }, 250);
    });
    
    // Touch/swipe support
    var touchStartX = 0;
    var touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        var swipeThreshold = 50;
        var diff = touchStartX - touchEndX;
        
        if (diff > swipeThreshold) {
            goToNext();
        } else if (diff < -swipeThreshold) {
            goToPrev();
        }
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('[data-aos]');
    
    if (animatedElements.length === 0) return;
    
    // Add initial styles
    for (var i = 0; i < animatedElements.length; i++) {
        var element = animatedElements[i];
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        var animation = element.getAttribute('data-aos');
        var delay = element.getAttribute('data-aos-delay') || 0;
        
        element.style.transitionDelay = delay + 'ms';
        
        if (animation === 'fade-up') {
            element.style.transform = 'translateY(40px)';
        } else if (animation === 'fade-down') {
            element.style.transform = 'translateY(-40px)';
        } else if (animation === 'fade-left') {
            element.style.transform = 'translateX(40px)';
        } else if (animation === 'fade-right') {
            element.style.transform = 'translateX(-40px)';
        } else if (animation === 'zoom-in') {
            element.style.transform = 'scale(0.9)';
        }
    }
    
    // Intersection Observer
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            for (var j = 0; j < entries.length; j++) {
                if (entries[j].isIntersecting) {
                    entries[j].target.style.opacity = '1';
                    entries[j].target.style.transform = 'translateY(0) translateX(0) scale(1)';
                    observer.unobserve(entries[j].target);
                }
            }
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        for (var k = 0; k < animatedElements.length; k++) {
            observer.observe(animatedElements[k]);
        }
    } else {
        // Fallback for old browsers
        for (var l = 0; l < animatedElements.length; l++) {
            animatedElements[l].style.opacity = '1';
            animatedElements[l].style.transform = 'none';
        }
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            
            if (href === '#') return;
            
            var target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                var headerOffset = 80;
                var elementPosition = target.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}
