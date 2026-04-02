const menuToggle = document.querySelector('#menu-toggle');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('header nav a');
const header = document.querySelector('.header');
const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');

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

contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const subject = formData.get('subject')?.toString().trim() || '';
    const phone = formData.get('phone')?.toString().trim() || '';
    const message = formData.get('message')?.toString().trim() || '';

    const emailSubject = encodeURIComponent(`Consulta desde portafolio: ${subject}`);
    const emailBody = encodeURIComponent(
        `Nombre: ${name}\nCorreo: ${email}\nTelefono: ${phone || 'No proporcionado'}\n\nMensaje:\n${message}`
    );

    window.location.href = `mailto:gustavoquintanahidalgo@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    if (formNote) {
        formNote.textContent = 'Tu cliente de correo deberia abrirse con el mensaje preparado.';
    }
});
