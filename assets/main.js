// ==================== MOBILE MENU TOGGLE ====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ==================== BACKGROUND MUSIC TOGGLE ====================
const bgAudio = document.getElementById('bgAudio');
const musicToggle = document.getElementById('musicToggle');
let isAudioPlaying = false;

if (bgAudio && musicToggle) {
    // Restore audio position from session storage
    const savedAudioTime = parseFloat(sessionStorage.getItem('audioTime')) || 0;
    
    // Set audio to start from saved time
    bgAudio.currentTime = savedAudioTime;
    
    // Set muted attribute to bypass autoplay restrictions
    bgAudio.muted = false;
    bgAudio.volume = 0.3;
    
    // Auto-play music on page load with a delay
    const playAudio = async () => {
        try {
            const playPromise = bgAudio.play();
            if (playPromise !== undefined) {
                await playPromise;
                isAudioPlaying = true;
                musicToggle.classList.add('playing');
            }
        } catch (error) {
            console.log('Auto-play blocked:', error);
            // Try again with user gesture
            const userGesturePlay = () => {
                bgAudio.play().then(() => {
                    isAudioPlaying = true;
                    musicToggle.classList.add('playing');
                }).catch(err => console.log('Still blocked:', err));
                document.removeEventListener('click', userGesturePlay);
                document.removeEventListener('touchstart', userGesturePlay);
            };
            document.addEventListener('click', userGesturePlay, { once: true });
            document.addEventListener('touchstart', userGesturePlay, { once: true });
        }
    };
    
    // Start playing after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(playAudio, 300);
        });
    } else {
        setTimeout(playAudio, 300);
    }

    // Toggle music on button click
    musicToggle.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (isAudioPlaying) {
            bgAudio.pause();
            isAudioPlaying = false;
            musicToggle.classList.remove('playing');
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            bgAudio.volume = 0.3;
            bgAudio.play().catch(error => {
                console.log('Could not play audio:', error);
            });
            isAudioPlaying = true;
            musicToggle.classList.add('playing');
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });

    // Update button icon when audio ends
    bgAudio.addEventListener('ended', () => {
        // Audio will loop, so this shouldn't happen unless loop is removed
    });

    // Save audio time before unload (when navigating to another page)
    window.addEventListener('beforeunload', () => {
        if (bgAudio && isAudioPlaying) {
            sessionStorage.setItem('audioTime', bgAudio.currentTime.toString());
        }
    });

    // Continuously save audio position while playing
    setInterval(() => {
        if (isAudioPlaying && bgAudio) {
            sessionStorage.setItem('audioTime', bgAudio.currentTime.toString());
        }
    }, 500);

    // Resume audio when window regains focus
    window.addEventListener('focus', () => {
        if (isAudioPlaying && bgAudio.paused) {
            bgAudio.play().catch(error => {
                console.log('Could not resume audio:', error);
            });
        }
    });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== NAVBAR BACKGROUND ON SCROLL ====================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ==================== SCROLL REVEAL ANIMATION ====================
const revealElements = document.querySelectorAll('[data-reveal]');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Call once on page load

// ==================== COUNTER ANIMATION ====================
const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// ==================== ACTIVE NAV LINK ====================
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    parallaxElements.forEach(element => {
        const scrollPosition = window.pageYOffset;
        const elementOffset = element.offsetTop;
        const distance = scrollPosition - elementOffset;
        const yPos = distance * 0.5;
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// ==================== FADE IN ON SCROLL ====================
const fadeInElements = () => {
    const elements = document.querySelectorAll('.project-card, .feature-card');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state
document.querySelectorAll('.project-card, .feature-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease-out';
});

window.addEventListener('scroll', fadeInElements);
window.addEventListener('load', fadeInElements);

// ==================== RIPPLE EFFECT ON BUTTONS ====================
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
        setTimeout(() => ripple.remove(), 600);
    });
});

// ==================== PROJECT CARD HOVER EFFECT ====================
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) rotateX(5deg)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0)';
    });
});

// ==================== TYPING EFFECT ====================
const typeEffect = (element, text, speed = 50) => {
    let index = 0;
    element.textContent = '';

    const type = () => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    };

    type();
};

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.animation = 'fadeIn 0.6s ease-out';
});

// ==================== SCROLL TO TOP BUTTON ====================
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        if (scrollToTopBtn) scrollToTopBtn.style.display = 'block';
    } else {
        if (scrollToTopBtn) scrollToTopBtn.style.display = 'none';
    }
});

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .feature-card').forEach(el => {
    observer.observe(el);
});

// ==================== DARK MODE TOGGLE ====================
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
};

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// ==================== FORM VALIDATION ====================
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = 'green';
        }
    });

    return isValid;
};

// ==================== LAZY LOADING IMAGES ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== SOUND EFFECTS ====================
const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.volume = 0.3;
    audio.play().catch(() => {
        // Sound play failed, continue silently
    });
};

// Add click sound to buttons
document.querySelectorAll('.btn, .social-btn, .project-link').forEach(element => {
    element.addEventListener('click', () => {
        // Optional: uncomment to add sound effect
        // playSound('path/to/click-sound.mp3');
    });
});

console.log('Portfolio JS loaded successfully!');
