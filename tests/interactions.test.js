const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const script = fs.readFileSync(path.join(__dirname, '..', 'js', 'script.js'), 'utf8');

function element(extra = {}) {
    const listeners = {};
    const classes = new Set();
    return {
        listeners,
        classList: {
            add: (name) => classes.add(name),
            remove: (name) => classes.delete(name),
            contains: (name) => classes.has(name),
            toggle: (name, force) => {
                const enabled = force ?? !classes.has(name);
                if (enabled) classes.add(name);
                else classes.delete(name);
                return enabled;
            }
        },
        addEventListener: (name, handler) => { listeners[name] = handler; },
        setAttribute: () => {},
        focus() { this.focused = true; },
        ...extra
    };
}

function loadSite() {
    const submitButton = element({ textContent: 'Preparar correo', disabled: true });
    const form = element({
        querySelector: () => submitButton,
        values: {
            name: 'Ana', email: 'ana@example.com', asunto: 'Proyecto web',
            phone: '', message: 'Necesito una API'
        }
    });
    const trigger = element({ dataset: {
        modalImage: 'project.jpg', modalAlt: 'Proyecto', modalTitle: 'Demo'
    } });
    const modal = element();
    const close = element();
    const note = element({ style: {} });
    const preview = element();
    const title = element();
    const nodes = {
        '#menu-toggle': element(), '#menu-icon': element(), '.navbar': element(),
        '.header': element(), '#contact-form': form, '#form-note': note,
        '#image-modal': modal, '#image-modal-preview': preview,
        '#image-modal-title': title, '#image-modal-close': close,
        '.footer-iconTop a': element()
    };
    const windowEvents = {};
    const window = {
        location: { href: '' },
        scrollY: 0,
        scrollTo(options) { this.scrollOptions = options; },
        addEventListener: (name, handler) => { windowEvents[name] = handler; }
    };
    const context = {
        document: {
            querySelector: (selector) => nodes[selector],
            querySelectorAll: (selector) => selector === '.project-image-trigger' ? [trigger] : [],
            body: { style: {} }
        },
        window,
        FormData: class {
            constructor(source) { this.values = source.values; }
            get(name) { return this.values[name]; }
        },
        fetch: () => { throw new Error('Unexpected network request'); },
        console
    };
    vm.runInNewContext(script, context);
    return { form, submitButton, trigger, modal, close, note, preview, title, window, windowEvents, backToTopButton: nodes['.footer-iconTop a'] };
}

test('prepara un correo sin enviar datos por red', () => {
    const site = loadSite();
    assert.equal(site.submitButton.textContent, 'Preparar correo');
    assert.equal(site.submitButton.disabled, false);
    site.form.listeners.submit({ preventDefault() {} });
    assert.match(site.window.location.href, /^mailto:gustavoquintanahidalgo@gmail\.com\?/);
    assert.match(decodeURIComponent(site.window.location.href), /Proyecto web[\s\S]*Necesito una API/);
    assert.equal(site.note.textContent, 'Revisa el mensaje en tu cliente de correo y pulsa enviar.');
});

test('el modal toma el foco, lo mantiene y lo devuelve al cerrar', () => {
    const site = loadSite();
    site.trigger.listeners.click();
    assert.equal(site.close.focused, true);
    assert.equal(site.modal.classList.contains('is-open'), true);
    let prevented = false;
    site.windowEvents.keydown({ key: 'Tab', preventDefault() { prevented = true; } });
    assert.equal(prevented, true);
    site.windowEvents.keydown({ key: 'Escape', preventDefault() {} });
    assert.equal(site.modal.classList.contains('is-open'), false);
    assert.equal(site.trigger.focused, true);
});

test('el boton de volver arriba desplaza al inicio', () => {
    const site = loadSite();
    let prevented = false;
    site.backToTopButton.listeners.click({ preventDefault() { prevented = true; } });
    assert.equal(prevented, true);
    assert.equal(site.window.scrollOptions.top, 0);
    assert.equal(site.window.scrollOptions.behavior, 'smooth');
});
