// Document-level client script.
// Touching this file should trigger a SOFT (client) reload, not a full SSR reload.

document.documentElement.dataset['clientReady'] = 'true';

console.log('[document.client] loaded');
