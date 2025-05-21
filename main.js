/**
 * PescaAventura - Main JavaScript
 * Handles interactivity and animations for the fishing website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initMobileMenu();
    initImageLoader();
    initCarousel();
    initSmoothScroll();
    initWeatherSelector();
});

/**
 * Mobile menu toggle functionality
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Animate hamburger menu bars
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target) && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
}

/**
 * Image loading animation
 */
function initImageLoader() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                img.classList.add('loaded');
            });
        }
    });
}

/**
 * Carousel/slider functionality
 */
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const nextButton = document.querySelector('.carousel-next');
    const prevButton = document.querySelector('.carousel-prev');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    const slideWidth = 100; // percentage
    
    // Set initial position
    updateCarousel();
    
    // Next button handler
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });
    }
    
    // Previous button handler
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }
    
    // Auto advance carousel every 5 seconds
    let carouselInterval = setInterval(autoAdvance, 5000);
    
    function autoAdvance() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }
    
    // Pause auto-advance when hovering over carousel
    track.addEventListener('mouseenter', function() {
        clearInterval(carouselInterval);
    });
    
    track.addEventListener('mouseleave', function() {
        carouselInterval = setInterval(autoAdvance, 5000);
    });
    
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
        
        // Update slide opacity for smooth transition
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.style.opacity = '1';
            } else {
                slide.style.opacity = '0.7';
            }
        });
    }
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mainNav = document.querySelector('.main-nav');
                const menuToggle = document.getElementById('mobile-menu');
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    
                    if (menuToggle) {
                        const bars = menuToggle.querySelectorAll('.bar');
                        bars[0].style.transform = 'none';
                        bars[1].style.opacity = '1';
                        bars[2].style.transform = 'none';
                    }
                }
            }
        });
    });
}

/**
 * Weather location selector
 */
function initWeatherSelector() {
    const locationSelect = document.getElementById('location-select');
    const weatherData = {
        'barcelona': {
            today: { icon: 'fa-sun', temp: '24°C' },
            tomorrow: { icon: 'fa-cloud-sun', temp: '22°C' },
            dayAfter: { icon: 'fa-cloud', temp: '20°C' }
        },
        'madrid': {
            today: { icon: 'fa-sun', temp: '26°C' },
            tomorrow: { icon: 'fa-sun', temp: '27°C' },
            dayAfter: { icon: 'fa-cloud-sun', temp: '24°C' }
        },
        'valencia': {
            today: { icon: 'fa-cloud-sun', temp: '23°C' },
            tomorrow: { icon: 'fa-sun', temp: '25°C' },
            dayAfter: { icon: 'fa-sun', temp: '26°C' }
        },
        'bilbao': {
            today: { icon: 'fa-cloud-rain', temp: '18°C' },
            tomorrow: { icon: 'fa-cloud', temp: '19°C' },
            dayAfter: { icon: 'fa-cloud-sun', temp: '21°C' }
        }
    };
    
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            const location = this.value;
            const data = weatherData[location];
            
            if (data) {
                updateWeatherDisplay(data);
            }
        });
        
        // Initialize with default selection
        const defaultLocation = locationSelect.value;
        if (weatherData[defaultLocation]) {
            updateWeatherDisplay(weatherData[defaultLocation]);
        }
    }
    
    function updateWeatherDisplay(data) {
        const days = document.querySelectorAll('.forecast-day');
        if (days.length >= 3) {
            // Today
            updateDay(days[0], data.today);
            // Tomorrow
            updateDay(days[1], data.tomorrow);
            // Day after tomorrow
            updateDay(days[2], data.dayAfter);
        }
    }
    
    function updateDay(dayElement, data) {
        const iconElement = dayElement.querySelector('i');
        const tempElement = dayElement.querySelector('span:last-child');
        
        if (iconElement) {
            // Remove all icon classes
            iconElement.className = '';
            // Add font awesome base class and new weather icon
            iconElement.classList.add('fas', data.icon);
        }
        
        if (tempElement) {
            tempElement.textContent = data.temp;
        }
    }
}

/**
 * Add parallax effect to hero section
 */
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const scrollPosition = window.pageYOffset;
        // Adjust background position based on scroll
        heroSection.style.backgroundPosition = `center ${50 + (scrollPosition * 0.05)}%`;
    }
});