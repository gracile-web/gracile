// Sibling client asset for (home) route.
// Touching this file should trigger a SOFT (client) reload, NOT a full SSR reload.

const marker = document.createElement('meta');
marker.name = 'hmr-client-marker';
marker.content = 'original';
document.head.append(marker);

console.log('[home.client] loaded');

console.log('abc');

console.log("hmr-debug-test");
