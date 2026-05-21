document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggler
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active-mobile');
            // Animate hamburger spans
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('active-mobile') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            spans[1].style.opacity = navMenu.classList.contains('active-mobile') ? '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('active-mobile') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
        });
    }

    // Add mobile active styles to css dynamically or inject
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
        @media (max-width: 768px) {
            .nav-menu.active-mobile {
                display: flex !important;
                flex-direction: column;
                position: absolute;
                top: 64px;
                left: 0;
                width: 100%;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid var(--border-glass);
                padding: 30px 24px;
                gap: 20px;
                z-index: 999;
                animation: slideDown 0.3s ease forwards;
            }
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // 2. Scroll Spy and Header Shrink
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Reveal Animations on Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Animates only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Bento Card Spotlight Hover Effect (Apple Style)
    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // 5. Modal Controllers (Impressum & Datenschutz)
    const modalImpressum = document.getElementById('modal-impressum');
    const modalDatenschutz = document.getElementById('modal-datenschutz');
    
    const btnImpressum = document.querySelectorAll('[data-open="impressum"]');
    const btnDatenschutz = document.querySelectorAll('[data-open="datenschutz"]');
    const closeButtons = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    const openModal = (modal) => {
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden'; // Stop scrolling behind modal
        }
    };

    const closeModal = () => {
        modalOverlays.forEach(overlay => overlay.classList.remove('open'));
        document.body.style.overflow = ''; // Restore scrolling
    };

    btnImpressum.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modalImpressum);
    }));

    btnDatenschutz.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modalDatenschutz);
    }));

    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
    
    // Close modal when clicking outside content
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // 6. Cookie Consent Management
    const cookieBanner = document.getElementById('cookie-banner');
    const btnAccept = document.getElementById('btn-cookie-accept');
    const btnReject = document.getElementById('btn-cookie-reject');

    const hideBanner = () => {
        if (!cookieBanner) return;
        cookieBanner.classList.remove('show');
        setTimeout(() => { cookieBanner.style.display = 'none'; }, 400);
    };

    const showBanner = () => {
        if (!cookieBanner) return;
        cookieBanner.style.display = 'flex';
        // Force reflow so the transition fires
        void cookieBanner.offsetHeight;
        cookieBanner.classList.add('show');
    };

    const checkCookieConsent = () => {
        const consent = localStorage.getItem('x-inspire-cookie-consent');
        if (!consent) {
            setTimeout(showBanner, 1000);
        }
    };

    if (btnAccept && btnReject && cookieBanner) {
        btnAccept.addEventListener('click', () => {
            localStorage.setItem('x-inspire-cookie-consent', 'accepted');
            hideBanner();
        });

        btnReject.addEventListener('click', () => {
            localStorage.setItem('x-inspire-cookie-consent', 'rejected');
            hideBanner();
        });
    }

    checkCookieConsent();


    // 7. Interactive Form Handler (Mock submit with validation and success overlay)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get inputs
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const message = document.getElementById('form-message').value;
            const privacyChecked = document.getElementById('form-privacy').checked;

            if (!name || !email || !message || !privacyChecked) {
                alert('Bitte füllen Sie alle erforderlichen Felder aus und stimmen Sie der Datenschutzerklärung zu.');
                return;
            }

            // Animate submit button
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Wird gesendet...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Show sleek success overlay inside the form
                const successDiv = document.createElement('div');
                successDiv.style.position = 'absolute';
                successDiv.style.top = '0';
                successDiv.style.left = '0';
                successDiv.style.width = '100%';
                successDiv.style.height = '100%';
                successDiv.style.background = 'var(--bg-obsidian)';
                successDiv.style.borderRadius = '24px';
                successDiv.style.display = 'flex';
                successDiv.style.flexDirection = 'column';
                successDiv.style.alignItems = 'center';
                successDiv.style.justifyContent = 'center';
                successDiv.style.padding = '40px';
                successDiv.style.textAlign = 'center';
                successDiv.style.zIndex = '10';
                successDiv.style.animation = 'fadeIn 0.5s ease forwards';
                
                successDiv.innerHTML = `
                    <div style="font-size: 3.5rem; margin-bottom: 20px; color: var(--accent-blue);">✓</div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 12px;">Vielen Dank!</h3>
                    <p style="color: var(--text-secondary); font-weight: 300; font-size: 0.95rem;">Ihre Nachricht wurde erfolgreich gesendet. Wir setzen uns zeitnah mit Ihnen in Verbindung.</p>
                `;

                contactForm.style.position = 'relative';
                contactForm.appendChild(successDiv);
            }, 1200);
        });
    }
});
