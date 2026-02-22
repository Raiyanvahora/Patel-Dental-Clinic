// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 600);
    }
});

// ===== MOBILE NAVIGATION =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');

function toggleMenu() {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}

if (navOverlay) {
    navOverlay.addEventListener('click', toggleMenu);
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks?.classList.contains('active')) {
        toggleMenu();
    }
});

// ===== NAVBAR SCROLL SHRINK + BACK TO TOP + MOBILE CTA =====
const navbar = document.querySelector('.navbar');
const backToTop = document.querySelector('.back-to-top');
const mobileCta = document.getElementById('mobileCta');
let scrollTicking = false;

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;

            // Navbar shrink
            if (navbar) {
                navbar.classList.toggle('scrolled', scrollY > 50);
            }

            // Back to top
            if (backToTop) {
                backToTop.classList.toggle('visible', scrollY > 400);
            }

            // Mobile CTA bar
            if (mobileCta) {
                mobileCta.classList.toggle('visible', scrollY > 300);
            }

            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== TESTIMONIALS SLIDER =====
const track = document.querySelector('.testimonials-track');
const dots = document.querySelectorAll('.testimonial-dot');
let currentSlide = 0;
let slidesPerView = 3;
let totalCards = 0;

function updateSlidesPerView() {
    if (window.innerWidth <= 768) {
        slidesPerView = 1;
    } else if (window.innerWidth <= 1024) {
        slidesPerView = 2;
    } else {
        slidesPerView = 3;
    }
}

function getMaxSlide() {
    if (!track) return 0;
    totalCards = track.children.length;
    return Math.max(0, totalCards - slidesPerView);
}

function updateSlider() {
    if (!track) return;
    const maxSlide = getMaxSlide();
    if (currentSlide > maxSlide) currentSlide = maxSlide;
    const offset = (currentSlide * (100 / slidesPerView));
    track.style.transform = `translateX(-${offset}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        currentSlide = i;
        updateSlider();
    });
});

// Auto-slide testimonials
let slideInterval;
function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(() => {
        const maxSlide = getMaxSlide();
        currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
        updateSlider();
    }, 4000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

// Touch swipe support for testimonials
let touchStartX = 0;
let touchEndX = 0;
let isSwiping = false;

if (track) {
    updateSlidesPerView();
    updateSlider();
    startAutoSlide();

    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    // Touch events for swipe
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isSwiping = true;
        stopAutoSlide();
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        touchEndX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
        if (!isSwiping) return;
        isSwiping = false;
        const swipeDistance = touchStartX - touchEndX;
        const minSwipe = 50;

        if (Math.abs(swipeDistance) > minSwipe) {
            const maxSlide = getMaxSlide();
            if (swipeDistance > 0 && currentSlide < maxSlide) {
                currentSlide++;
            } else if (swipeDistance < 0 && currentSlide > 0) {
                currentSlide--;
            }
            updateSlider();
        }
        startAutoSlide();
    });
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateSlidesPerView();
        updateSlider();
    }, 150);
});

// ===== GALLERY LIGHTBOX =====
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const galleryItems = document.querySelectorAll('.gallery-item');
let lightboxIndex = 0;
let galleryImages = [];

galleryItems.forEach((item, i) => {
    const img = item.querySelector('img');
    if (img) {
        galleryImages.push(img.src);
        item.addEventListener('click', () => {
            lightboxIndex = i;
            openLightbox();
        });
    }
});

function openLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = galleryImages[lightboxIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

lightboxPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxIndex = lightboxIndex > 0 ? lightboxIndex - 1 : galleryImages.length - 1;
    lightboxImg.src = galleryImages[lightboxIndex];
});

lightboxNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxIndex = lightboxIndex < galleryImages.length - 1 ? lightboxIndex + 1 : 0;
    lightboxImg.src = galleryImages[lightboxIndex];
});

// Lightbox swipe support
let lbTouchStartX = 0;
let lbTouchEndX = 0;

lightbox?.addEventListener('touchstart', (e) => {
    lbTouchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox?.addEventListener('touchend', (e) => {
    lbTouchEndX = e.changedTouches[0].screenX;
    const swipe = lbTouchStartX - lbTouchEndX;
    if (Math.abs(swipe) > 50) {
        if (swipe > 0) {
            lightboxIndex = lightboxIndex < galleryImages.length - 1 ? lightboxIndex + 1 : 0;
        } else {
            lightboxIndex = lightboxIndex > 0 ? lightboxIndex - 1 : galleryImages.length - 1;
        }
        if (lightboxImg) lightboxImg.src = galleryImages[lightboxIndex];
    }
});

document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev?.click();
    if (e.key === 'ArrowRight') lightboxNext?.click();
});

// ===== SCROLL ANIMATIONS =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .feature-item, .team-card, .stat-box, .about-point, .gallery-item, .contact-item, .patient-photo, .wc-img, .showcase-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Add stagger delay
    document.querySelectorAll('.services-grid, .features-grid, .stats-grid, .gallery-grid, .team-grid, .patients-photos').forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.08}s`;
        });
    });

    // CSS class for animation
    const style = document.createElement('style');
    style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    document.querySelectorAll('.stat-box .number, .hero-stat .number, .about-experience .number').forEach(counter => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';
        const target = counter.textContent;
        const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
        const suffix = target.replace(/[0-9]/g, '');
        let current = 0;
        const step = numericTarget / 40;

        const counterInterval = setInterval(() => {
            current += step;
            if (current >= numericTarget) {
                current = numericTarget;
                clearInterval(counterInterval);
            }
            counter.textContent = Math.floor(current) + suffix;
        }, 30);
    });
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-grid') || document.querySelector('.hero-stats');
if (statsSection) counterObserver.observe(statsSection);

// ===== APPOINTMENT FORM =====
const appointmentForm = document.querySelector('.appointment-form form');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(appointmentForm);
        const name = formData.get('name') || '';
        const phone = formData.get('phone') || '';
        const service = formData.get('service') || '';
        const message = formData.get('message') || '';

        // Build WhatsApp message
        let waMessage = `Hello! I'd like to book an appointment.\n\n`;
        waMessage += `Name: ${name}\n`;
        if (phone) waMessage += `Phone: ${phone}\n`;
        if (service) waMessage += `Service: ${service}\n`;
        if (message) waMessage += `Message: ${message}\n`;

        const waUrl = `https://wa.me/917096692364?text=${encodeURIComponent(waMessage)}`;
        window.open(waUrl, '_blank');

        // Show success message
        const btn = appointmentForm.querySelector('.btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fab fa-whatsapp"></i> Redirecting to WhatsApp...';
        btn.style.background = '#25D366';
        btn.style.borderColor = '#25D366';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.borderColor = '';
            appointmentForm.reset();
        }, 3000);
    });
}

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a:not(.btn)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});
