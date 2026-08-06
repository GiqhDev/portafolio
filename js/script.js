const menuToggle = document.querySelector('#menu-toggle');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('header nav a');
const header = document.querySelector('.header');
const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');
const imageTriggers = document.querySelectorAll('.project-image-trigger');
const imageModal = document.querySelector('#image-modal');
const imageModalPreview = document.querySelector('#image-modal-preview');
const imageModalTitle = document.querySelector('#image-modal-title');
const imageModalClose = document.querySelector('#image-modal-close');
const backToTopButton = document.querySelector('.footer-iconTop a');

const openImageModal = (trigger) => {
    if (!imageModal || !imageModalPreview || !imageModalTitle) {
        return;
    }

    const imageSrc = trigger.dataset.modalImage || '';
    const imageAlt = trigger.dataset.modalAlt || '';
    const imageTitle = trigger.dataset.modalTitle || 'Vista ampliada';

    imageModalPreview.src = imageSrc;
    imageModalPreview.alt = imageAlt;
    imageModalTitle.textContent = imageTitle;
    imageModal.classList.add('is-open');
    imageModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

const closeImageModal = () => {
    if (!imageModal || !imageModalPreview) {
        return;
    }

    imageModal.classList.remove('is-open');
    imageModal.setAttribute('aria-hidden', 'true');
    imageModalPreview.src = '';
    imageModalPreview.alt = '';
    document.body.style.overflow = '';
};

const closeMenu = () => {
    navbar.classList.remove('active');
    menuIcon.classList.remove('bx-x');
    menuIcon.classList.add('bx-menu');
    menuToggle.setAttribute('aria-expanded', 'false');
};

menuToggle?.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('active');

    menuIcon.classList.toggle('bx-menu', !isOpen);
    menuIcon.classList.toggle('bx-x', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
});

const updateActiveLink = () => {
    const scrollPosition = window.scrollY + 180;

    sections.forEach((section) => {
        const offsetTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + sectionHeight) {
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
            });
        }
    });
};

window.addEventListener('scroll', () => {
    header.classList.toggle('sticky', window.scrollY > 40);
    updateActiveLink();
    closeMenu();
});

navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
});

updateActiveLink();

backToTopButton?.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

imageTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openImageModal(trigger));
});

imageModalClose?.addEventListener('click', closeImageModal);

imageModal?.addEventListener('click', (event) => {
    const target = event.target;

    if (target instanceof HTMLElement && target.dataset.closeModal === 'true') {
        closeImageModal();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && imageModal?.classList.contains('is-open')) {
        closeImageModal();
    }
});

if (window.ScrollReveal) {
    const sr = ScrollReveal({
        distance: '60px',
        duration: 900,
        delay: 120,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        reset: false
    });

    sr.reveal('.home-content, .section-header, .contact-panel', { origin: 'left' });
    sr.reveal('.home-visual, .about-img, .contact-form', { origin: 'right' });
    sr.reveal('.services-box, .portfolio-box, .highlight-card', {
        origin: 'bottom',
        interval: 120
    });
}

if (window.Typed) {
    new Typed('.multiple-text', {
        strings: [
            'APIs modernas y robustas',
            'experiencias web y desktop',
            'soluciones listas para crecer'
        ],
        typeSpeed: 55,
        backSpeed: 32,
        backDelay: 1300,
        loop: true
    });
}

contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.textContent || 'Enviar mensaje';
    
    if (submitButton) {
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
    }

    try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            if (formNote) {
                formNote.textContent = 'Mensaje enviado correctamente. Te respondere pronto.';
                formNote.style.color = '#77e6b6';
            }
            contactForm.reset();
        } else {
            throw new Error(result.message || 'Error al enviar');
        }
    } catch (error) {
        if (formNote) {
            formNote.textContent = 'Error al enviar. Intenta contactarme por correo o WhatsApp.';
            formNote.style.color = '#ff6b6b';
        }
        console.error('Error:', error);
    } finally {
        if (submitButton) {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    }
});

// Contador de visitas global con CountAPI
const initVisitCounter = async () => {
    const counterElement = document.querySelector('#visit-count');
    if (!counterElement) return;

    try {
        const namespace = 'portafolio-giqhdev';
        const key = 'visitas';
        const response = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`);
        const data = await response.json();
        counterElement.textContent = data.value.toLocaleString('es-UY');
    } catch (error) {
        counterElement.textContent = '--';
        console.error('Error al cargar contador:', error);
    }
};

initVisitCounter();
