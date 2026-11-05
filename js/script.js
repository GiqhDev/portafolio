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

const web3FormsKey = contactForm?.elements.namedItem('access_key')?.value.trim();
const hasWeb3FormsKey = Boolean(web3FormsKey && web3FormsKey !== 'TU_ACCESS_KEY_AQUI');
const contactSubmitButton = contactForm?.querySelector('button[type="submit"]');

if (contactSubmitButton && !hasWeb3FormsKey) {
    contactSubmitButton.textContent = 'Preparar correo';
}
if (formNote && hasWeb3FormsKey) {
    formNote.textContent = 'Tu mensaje se enviara directamente desde el formulario.';
}

contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    if (!hasWeb3FormsKey) {
        const subject = encodeURIComponent(`Consulta desde portafolio: ${formData.get('asunto')}`);
        const body = encodeURIComponent(
            `Nombre: ${formData.get('name')}\nCorreo: ${formData.get('email')}\nTelefono: ${formData.get('phone') || 'No proporcionado'}\n\nMensaje:\n${formData.get('message')}`
        );
        window.location.href = `mailto:gustavoquintanahidalgo@gmail.com?subject=${subject}&body=${body}`;
        if (formNote) {
            formNote.textContent = 'Revisa el mensaje en tu cliente de correo y pulsa enviar.';
        }
        return;
    }

    if (contactSubmitButton) {
        contactSubmitButton.textContent = 'Enviando...';
        contactSubmitButton.disabled = true;
    }

    try {
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
        if (contactSubmitButton) {
            contactSubmitButton.textContent = 'Enviar mensaje';
            contactSubmitButton.disabled = false;
        }
    }
});

const initVisitCounter = async () => {
    const counterElement = document.querySelector('#visit-count');
    const labelElement = document.querySelector('#visit-label');
    if (!counterElement || !labelElement) return;

    const LOCAL_KEY = 'portafolio_visitas';

    const showLocalCount = () => {
        try {
            const count = (parseInt(localStorage.getItem(LOCAL_KEY) || '0', 10) || 0) + 1;
            localStorage.setItem(LOCAL_KEY, count.toString());
            labelElement.textContent = 'Visitas en este navegador:';
            counterElement.textContent = count.toLocaleString('es-UY');
        } catch {
            labelElement.textContent = 'Visitas:';
            counterElement.textContent = 'no disponibles';
        }
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    try {
        const response = await fetch(
            'https://api.countapi.xyz/hit/portafolio-giqhdev/visitas',
            { signal: controller.signal }
        );
        if (!response.ok) throw new Error('API no disponible');

        const data = await response.json();
        if (!Number.isSafeInteger(data.value) || data.value < 0) {
            throw new Error('Respuesta invalida del contador');
        }
        labelElement.textContent = 'Visitas totales:';
        counterElement.textContent = data.value.toLocaleString('es-UY');
    } catch {
        showLocalCount();
    } finally {
        clearTimeout(timeout);
    }
};

initVisitCounter();
