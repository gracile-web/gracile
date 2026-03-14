// import '@gracile/gracile/hydration-elements';
import '../lib/router.js';

import '../lib/iconify-icon.js';
import '../lib/copy-button.js';
// import { isServer } from 'lit';

import '../lib/keep-scroll-position/keep-scroll-position.js';

import { Prefetcher } from '../lib/prefetch/prefetch-document.js';

const prefetcher = new Prefetcher();
prefetcher.collectLinks();

// import '../lib/copy-button.jsx';
// import '../lib/iconify-icon.js';

requestIdleCallback(() => {
  import('../lib/color-mode/color-mode.js');
  import('@shoelace-style/shoelace/dist/components/tooltip/tooltip.js');
  import('../features/search-popup.js');
});
