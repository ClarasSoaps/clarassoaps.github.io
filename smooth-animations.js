// EXTRA CREAMY smooth animations for Clara's Soap

// Page load animation - fade in smoothly
window.addEventListener('pageshow', function(event) {
    // Handle both regular loads and back/forward navigation
    if (event.persisted) {
        document.body.style.opacity = '1';
    } else {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    }
});

// Smooth scroll with easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add butter-smooth hover effects to product cards
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        this.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
    
    card.addEventListener('mouseleave', function(e) {
        this.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
    });
});

// Add ripple effect to buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
    });
});

// Smooth reveal on scroll
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
});

// Add subtle shadow to navbar on scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 10) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }, { passive: true });
}

// Smooth number counter for cart badge
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 20;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.ceil(current);
        }
    }, 30);
}

// Enhanced cart badge animation
const cartCount = document.getElementById('cartCount');
if (cartCount) {
    const observer = new MutationObserver(() => {
        cartCount.style.animation = 'none';
        setTimeout(() => {
            cartCount.style.animation = 'cartPulse 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 10);
    });
    
    observer.observe(cartCount, { 
        childList: true, 
        characterData: true, 
        subtree: true 
    });
}

// Add subtle floating animation to flowers
const flowers = document.querySelectorAll('.flower');
flowers.forEach((flower, index) => {
    flower.style.animationDuration = `${25 + index * 2}s`;
    flower.style.animationTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
});

// Smooth page transitions
let isTransitioning = false;
document.querySelectorAll('a:not([onclick]):not([href^="#"]):not([href^="mailto"]):not([href^="tel"])').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href.endsWith('.html') || href.indexOf('.html?') > -1) && !link.target) {
        link.addEventListener('click', function(e) {
            if (isTransitioning) return;
            
            e.preventDefault();
            isTransitioning = true;
            
            document.body.style.transition = 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = href;
            }, 250);
        });
    }
});
