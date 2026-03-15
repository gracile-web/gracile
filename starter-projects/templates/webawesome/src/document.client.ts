import { createHydrationRoot } from '@gracile/gracile/hydration-full';

createHydrationRoot({ signalHost: true });

console.log('Global client scripts here!');
