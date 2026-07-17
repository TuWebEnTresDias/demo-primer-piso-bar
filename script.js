/**
 * PRIMER PISO BAR - JavaScript
 * Interactividad: Animaciones, Menú Mobile, Tabs, Formulario WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    const handleHeaderScroll = () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // ============================================
    // MOBILE MENU
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.header__nav-link');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('active')) {
            closeMenu();
        }
    });

    // ============================================
    // MENU TABS
    // ============================================
    const menuTabs = document.querySelectorAll('.menu__tab');
    const menuCategories = document.querySelectorAll('.menu__category');

    const switchTab = (tabName) => {
        // Update tabs
        menuTabs.forEach(tab => {
            tab.classList.remove('menu__tab--active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('menu__tab--active');
            }
        });

        // Update categories
        menuCategories.forEach(category => {
            category.classList.remove('menu__category--active');
            if (category.id === tabName) {
                category.classList.add('menu__category--active');
            }
        });
    };

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const animateOnScroll = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for elements in the same section
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate-visible');
                }, delay * 100);
                
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    // Observe all animate-in elements with staggered delays
    const animateElements = document.querySelectorAll('.animate-in');
    animateElements.forEach((el, index) => {
        // Calculate delay based on position within section
        const parent = el.parentElement;
        const siblings = parent.querySelectorAll('.animate-in');
        const siblingIndex = Array.from(siblings).indexOf(el);
        el.dataset.delay = siblingIndex;
        
        observer.observe(el);
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // FORM TO WHATSAPP
    // ============================================
    const reservationForm = document.getElementById('reservationForm');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const date = document.getElementById('date').value;
            const guests = document.getElementById('guests').value;
            const message = document.getElementById('message').value.trim();
            
            // Format date nicely
            let formattedDate = '';
            if (date) {
                const dateObj = new Date(date + 'T00:00:00');
                formattedDate = dateObj.toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                });
            }
            
            // Build WhatsApp message
            let whatsappMessage = `¡Hola! Quiero hacer una reserva en Primer Piso Bar\n\n`;
            whatsappMessage += `👤 *Nombre:* ${name}\n`;
            whatsappMessage += `📱 *WhatsApp:* ${phone}\n`;
            
            if (formattedDate) {
                whatsappMessage += `📅 *Fecha:* ${formattedDate}\n`;
            }
            
            if (guests) {
                whatsappMessage += `👥 *Personas:* ${guests}\n`;
            }
            
            if (message) {
                whatsappMessage += `💬 *Mensaje:* ${message}\n`;
            }
            
            whatsappMessage += `\nMuchas gracias!`;
            
            // Encode message for WhatsApp URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/5491157250961?text=${encodedMessage}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            reservationForm.reset();
        });
    }

    // ============================================
    // GALLERY LIGHTBOX EFFECT
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery__item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                // Create lightbox
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox__overlay"></div>
                    <div class="lightbox__content">
                        <img src="${img.src}" alt="${img.alt}">
                        <button class="lightbox__close" aria-label="Cerrar">×</button>
                    </div>
                `;
                
                // Add styles
                lightbox.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                `;
                
                const overlay = lightbox.querySelector('.lightbox__overlay');
                overlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    cursor: pointer;
                `;
                
                const content = lightbox.querySelector('.lightbox__content');
                content.style.cssText = `
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                `;
                
                const lightboxImg = lightbox.querySelector('img');
                lightboxImg.style.cssText = `
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                    border-radius: 4px;
                `;
                
                const closeBtn = lightbox.querySelector('.lightbox__close');
                closeBtn.style.cssText = `
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    padding: 0.5rem;
                    line-height: 1;
                `;
                
                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';
                
                // Close functions
                const closeLightbox = () => {
                    lightbox.style.opacity = '0';
                    setTimeout(() => {
                        lightbox.remove();
                        document.body.style.overflow = '';
                    }, 300);
                };
                
                closeBtn.addEventListener('click', closeLightbox);
                overlay.addEventListener('click', closeLightbox);
                
                document.addEventListener('keydown', function escHandler(e) {
                    if (e.key === 'Escape') {
                        closeLightbox();
                        document.removeEventListener('keydown', escHandler);
                    }
                });
            }
        });
    });

    // ============================================
    // PARALLAX EFFECT ON HERO (subtle)
    // ============================================
    const heroImg = document.querySelector('.hero__bg-img');
    
    if (heroImg) {
        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            
            if (scrolled < heroHeight) {
                const parallaxValue = scrolled * 0.3;
                heroImg.style.transform = `scale(1.05) translateY(${parallaxValue}px)`;
            }
        };

        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // ============================================
    // WHATSAPP FLOAT - Show after scroll
    // ============================================
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    if (whatsappFloat) {
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.visibility = 'hidden';
        whatsappFloat.style.transition = 'opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease';
        
        const showWhatsApp = () => {
            if (window.pageYOffset > 300) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.visibility = 'visible';
            } else {
                whatsappFloat.style.opacity = '0';
                whatsappFloat.style.visibility = 'hidden';
            }
        };

        window.addEventListener('scroll', showWhatsApp, { passive: true });
    }

    // ============================================
    // COUNTER ANIMATION FOR RATING
    // ============================================
    const ratingNumber = document.querySelector('.testimonials__rating-number');
    
    if (ratingNumber) {
        let animated = false;
        
        const animateCounter = (element, target) => {
            let current = 0;
            const increment = target / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target.toFixed(1);
                    clearInterval(timer);
                } else {
                    element.textContent = current.toFixed(1);
                }
            }, 50);
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    animateCounter(ratingNumber, 3.6);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(ratingNumber);
    }

    // ============================================
    // ADD CSS ANIMATION KEYFRAMES
    // ============================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // INITIAL LOAD ANIMATIONS
    // ============================================
    // Trigger hero animations immediately
    setTimeout(() => {
        document.querySelectorAll('.hero .animate-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-visible');
            }, index * 200);
        });
    }, 300);
});

// ============================================
// PERFORMANCE: Lazy load images that aren't in viewport
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}