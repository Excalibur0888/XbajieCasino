// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function(e) {
            // Ensure the event works whether clicking on the button or the icon inside
            mainNav.classList.toggle('active');
            
            // Add visual feedback
            if (mainNav.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-times"></i>';
                document.body.style.overflow = 'hidden';
            } else {
                this.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
            
            // Prevent event bubbling issues
            e.stopPropagation();
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target) && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when window resizes above mobile breakpoint
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Rotate winners in ticker with a fade effect
    const rotateWinners = () => {
        const winners = document.querySelectorAll('.winner-update');
        if (winners.length > 1) {
            let activeIndex = 0;
            
            // Find the currently visible winner
            winners.forEach((winner, index) => {
                if (!winner.classList.contains('hidden')) {
                    activeIndex = index;
                }
            });
            
            // Create fade effect
            const currentWinner = winners[activeIndex];
            currentWinner.style.opacity = '0';
            
            setTimeout(() => {
                // Hide current winner
                currentWinner.classList.add('hidden');
                
                // Show next winner
                const nextIndex = (activeIndex + 1) % winners.length;
                winners[nextIndex].classList.remove('hidden');
                winners[nextIndex].style.opacity = '0';
                
                // Fade in
                setTimeout(() => {
                    winners[nextIndex].style.opacity = '1';
                }, 50);
            }, 500);
        }
    };
    
    // Rotate winners every 5 seconds
    setInterval(rotateWinners, 5000);

    // Search and category functionality
    const searchInput = document.querySelector('.search-input');
    const categoryItems = document.querySelectorAll('.category-item');
    
    // Функция для фильтрации категорий по поисковому запросу
    function filterCategories(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        
        categoryItems.forEach(item => {
            const categoryName = item.querySelector('span:first-of-type').textContent.toLowerCase();
            
            if (categoryName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Handle search input
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            filterCategories(searchTerm);
            
            // Если поле поиска пустое, показать все категории
            if (searchTerm === '') {
                categoryItems.forEach(item => {
                    item.style.display = 'flex';
                });
            }
        });
    }
    
    // Handle category selection with hover effects
    categoryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        // Обработка клика по категории
        item.addEventListener('click', function(e) {
            // Клик уже обрабатывается ссылкой, так что дополнительно ничего делать не нужно
            this.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                this.style.transform = 'translateY(-2px)';
            }, 150);
        });
    });

    // Hero Slider functionality
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    const sliderControls = document.querySelector('.slider-controls');
    let currentSlide = 0;
    
    // Prevent redirect when clicking on slider controls
    if (sliderControls) {
        sliderControls.addEventListener('click', (e) => {
            if (e.target.closest('.slider-arrow') || e.target.closest('.slider-dot')) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }
    
    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the selected slide and activate corresponding dot
        slides[index].classList.add('active');
        slides[index].style.display = 'block';
        dots[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
    }
    
    // Set up event listeners for dots
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showSlide(index);
            });
        });
    }
    
    // Previous and next button functionality
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            let newIndex = currentSlide - 1;
            if (newIndex < 0) newIndex = slides.length - 1;
            showSlide(newIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            let newIndex = currentSlide + 1;
            if (newIndex >= slides.length) newIndex = 0;
            showSlide(newIndex);
        });
    }
    
    // Auto rotate slides every 5 seconds if slides exist
    if (slides.length > 0) {
        setInterval(() => {
            let newIndex = currentSlide + 1;
            if (newIndex >= slides.length) newIndex = 0;
            showSlide(newIndex);
        }, 5000);
    }

    // Smooth reveal animations for cards using Intersection Observer
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

    // Observe all cards and sections for animation
    const animatedElements = document.querySelectorAll('.game-card, .feature, .live-game');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Fixed action buttons visibility
    const fixedActions = document.querySelector('.fixed-actions');
    if (fixedActions) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                fixedActions.style.opacity = '1';
                fixedActions.style.visibility = 'visible';
            } else {
                fixedActions.style.opacity = '0.8';
            }
        });
    }

    // Game card hover effects
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Copy bonus codes to clipboard
    const bonusCodes = document.querySelectorAll('.promo-code');
    bonusCodes.forEach(code => {
        code.addEventListener('click', function() {
            const text = this.textContent.replace('Code: ', '');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    // Show temporary feedback
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    this.style.background = '#4ecdc4';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = '';
                    }, 2000);
                });
            }
        });
    });

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        if (question) {
            question.style.cursor = 'pointer';
            question.addEventListener('click', function() {
                const answer = item.querySelector('p');
                if (answer.style.display === 'none') {
                    answer.style.display = 'block';
                    this.style.color = '#ffd700';
                } else {
                    answer.style.display = 'none';
                    this.style.color = '';
                }
            });
        }
    });

    // Testimonial rotation
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length > 1) {
        let currentTestimonial = 0;
        
        setInterval(() => {
            testimonials[currentTestimonial].style.opacity = '0.7';
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].style.opacity = '1';
        }, 5000);
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[src=""]');
    images.forEach(img => {
        // Set placeholder background for empty images
        img.style.background = 'linear-gradient(45deg, #ffd700, #ffed4e, #ff6b6b)';
        img.style.minHeight = '150px';
        img.style.borderRadius = '8px';
    });

    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(function() {
            // Handle scroll-based animations here
            const scrolled = window.scrollY;
            const header = document.querySelector('.header');
            
            if (scrolled > 100 && header) {
                header.style.background = 'rgba(26, 26, 46, 0.98)';
                header.style.backdropFilter = 'blur(15px)';
            } else if (header) {
                header.style.background = 'rgba(26, 26, 46, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }
        }, 10);
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key to close any open modals or menus
        if (e.key === 'Escape') {
            const activeElements = document.querySelectorAll('.active');
            activeElements.forEach(el => {
                if (!el.classList.contains('nav-link')) {
                    el.classList.remove('active');
                }
            });
        }
        
        // Enter key on focused elements
        if (e.key === 'Enter') {
            const focused = document.activeElement;
            if (focused && (focused.classList.contains('category-item') || focused.classList.contains('game-card'))) {
                focused.click();
            }
        }
    });

    // Add loading states for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.opacity = '0.7';
                this.style.transform = 'scale(0.98)';
                
                setTimeout(() => {
                    this.style.opacity = '';
                    this.style.transform = '';
                }, 200);
            }
        });
    });

    // Console welcome message
    console.log('%c🎰 Welcome to Xbajie Casino! 🎰', 'color: #ffd700; font-size: 20px; font-weight: bold;');
    console.log('%cExperience the thrill of Bangladesh\'s premier online casino!', 'color: #ff6b6b; font-size: 14px;');

    // Redirect function for all call to action buttons
    window.redirectToSite = function() {
        window.open('https://negolous.com/DMvtpnRY', '_blank');
    }

    // Stop redirects on slider container except for buttons/links
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('click', function(e) {
            // Не блокируем клики на кнопках и ссылках
            if (!e.target.closest('.btn') && !e.target.closest('a')) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }
});

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('bn-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0
    }).format(amount);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4ecdc4' : type === 'error' ? '#ff6b6b' : '#ffd700'};
        color: ${type === 'info' ? '#1a1a2e' : 'white'};
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

