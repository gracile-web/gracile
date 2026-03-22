// import '@lit-labs/ssr-client/lit-element-hydrate-support.js';

import { createHydrationRoot } from '@gracile/gracile/hydration-full';
import { setSignalConstructor } from '@gracile-labs/functional';
import { Signal } from '@lit-labs/signals';

createHydrationRoot({ signalHost: true });
// import './features/title-element.element.js';

setSignalConstructor(Signal);

console.log('Global client scripts here!');
