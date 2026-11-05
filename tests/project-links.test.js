const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('no ofrece enlaces a repositorios privados', () => {
    const privateRepositories = [
        'GiqhDev/BarberSaaS',
        'GiqhDev/BarberSaaS.Mobile',
        'GiqhDev/SoporteTicketera',
        'gqh22/ATRiX'
    ];

    for (const repository of privateRepositories) {
        assert.equal(html.includes(`href="https://github.com/${repository}"`), false, repository);
    }
});
