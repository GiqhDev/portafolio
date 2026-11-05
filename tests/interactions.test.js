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

function loadSite({ accessKey = 'TU_ACCESS_KEY_AQUI', counterResponse, storageError = false } = {}) {
    const submitButton = element({ textContent: 'Enviar mensaje' });
    const form = element({
        elements: { namedItem: () => ({ value: accessKey }) },
        querySelector: () => submitButton,
        reset() { this.resetCalled = true; },
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
    const label = element();
    const count = element();
    const note = element({ style: {} });
    const preview = element();
    const title = element();
    const nodes = {
        '#menu-toggle': element(), '#menu-icon': element(), '.navbar': element(),
        '.header': element(), '#contact-form': form, '#form-note': note,
        '#image-modal': modal, '#image-modal-preview': preview,
        '#image-modal-title': title, '#image-modal-close': close,
        '.footer-iconTop a': element(), '#visit-label': label, '#visit-count': count
    };
    const windowEvents = {};
    const fetchCalls = [];
    const window = {
        location: { href: '' },
        scrollY: 0,
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
        fetch: async (url) => {
            fetchCalls.push(url);
            if (url.includes('countapi')) {
                if (counterResponse instanceof Error) throw counterResponse;
                return counterResponse ?? { ok: true, json: async () => ({ value: 42 }) };
            }
            return { json: async () => ({ success: true }) };
        },
        localStorage: {
            getItem: () => { if (storageError) throw new Error('blocked'); return '2'; },
            setItem: () => { if (storageError) throw new Error('blocked'); }
        },
        setTimeout,
        clearTimeout,
        AbortController,
        console
    };
    vm.runInNewContext(script, context);
    return { form, submitButton, trigger, modal, close, label, count, note, preview, title, window, windowEvents, fetchCalls };
}

test('sin clave, prepara un correo y no intenta enviarlo por Web3Forms', async () => {
    const site = loadSite();
    assert.equal(site.submitButton.textContent, 'Preparar correo');
    await site.form.listeners.submit({ preventDefault() {} });
    assert.match(site.window.location.href, /^mailto:gustavoquintanahidalgo@gmail\.com\?/);
    assert.match(decodeURIComponent(site.window.location.href), /Proyecto web[\s\S]*Necesito una API/);
    assert.equal(site.fetchCalls.some((url) => url.includes('web3forms')), false);
    assert.equal(site.form.resetCalled, undefined);
});

test('con clave, envia por Web3Forms y confirma solo tras una respuesta exitosa', async () => {
    const site = loadSite({ accessKey: 'configured-key' });
    await site.form.listeners.submit({ preventDefault() {} });
    assert.equal(site.fetchCalls.some((url) => url.includes('web3forms')), true);
    assert.equal(site.form.resetCalled, true);
    assert.equal(site.window.location.href, '');
});

test('si falla la API de visitas, identifica el conteo como local', async () => {
    const site = loadSite({ counterResponse: new Error('offline') });
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(site.label.textContent, 'Visitas en este navegador:');
    assert.equal(site.count.textContent, '3');
});

test('si responde la API, identifica el total global', async () => {
    const site = loadSite();
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(site.label.textContent, 'Visitas totales:');
    assert.equal(site.count.textContent, '42');
});

test('si no hay almacenamiento local, no inventa una cifra de visitas', async () => {
    const site = loadSite({ counterResponse: new Error('offline'), storageError: true });
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(site.count.textContent, 'no disponibles');
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
