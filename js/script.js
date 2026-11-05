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
let imageModalOpener = null;

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
    imageModalOpener = trigger;
    imageModalClose?.focus();
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
    imageModalOpener?.focus();
    imageModalOpener = null;
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
    if (!imageModal?.classList.contains('is-open')) {
        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        closeImageModal();
    } else if (event.key === 'Tab') {
        event.preventDefault();
        imageModalClose?.focus();
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

const contactSubmitButton = contactForm?.querySelector('button[type="submit"]');

if (contactSubmitButton) {
    contactSubmitButton.disabled = false;
}

contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const subject = encodeURIComponent(`Consulta desde portafolio: ${formData.get('asunto')}`);
    const body = encodeURIComponent(
        `Nombre: ${formData.get('name')}\nCorreo: ${formData.get('email')}\nTelefono: ${formData.get('phone') || 'No proporcionado'}\n\nMensaje:\n${formData.get('message')}`
    );
    window.location.href = `mailto:gustavoquintanahidalgo@gmail.com?subject=${subject}&body=${body}`;

    if (formNote) {
        formNote.textContent = 'Revisa el mensaje en tu cliente de correo y pulsa enviar.';
    }
});
