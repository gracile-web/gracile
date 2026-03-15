import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../document.js';
import { topMenu } from '../features/top-menu.js';

export default defineRoute({
	document: (context) =>
		document({ ...context, title: 'Gracile - A Story about Bird' }),

	template: () => html`
		${topMenu()}

		<h1>The Fisherman and the Seabird</h1>

		<article>
			<p>
				Once upon a time, in a quaint coastal village, there lived an old
				fisherman named <span class="highlight">Thomas</span>. Thomas had spent
				his entire life by the sea, waking up at dawn each day to set sail in
				his small, weathered boat. He was known by everyone in the village for
				his skill, patience, and a peculiar old hat that he always wore—a faded
				navy-blue cap, adorned with a single white feather.
			</p>

			<p>
				This hat was more than just a piece of clothing to Thomas; it was a
				<span class="highlight">symbol of good fortune</span>. Passed down from
				his grandfather, the hat had seen many storms and calm seas, and Thomas
				believed it brought him luck on every fishing trip.
			</p>

			<p>
				One bright morning, as the sun began to rise over the horizon, Thomas
				set out for his daily voyage. The sea was calm, and the sky was clear,
				promising a bountiful day of fishing. With his hat perched firmly on his
				head, Thomas hummed a tune as he cast his nets into the shimmering
				water.
			</p>

			<p>
				Hours passed, and Thomas's nets were beginning to fill with the day's
				catch. As he worked, he didn't notice a
				<span class="highlight">large seabird</span> circling above him, its
				sharp eyes fixed on his hat. The bird, a curious and mischievous
				creature, swooped down silently, and with a swift motion, it snatched
				the hat right off Thomas's head!
			</p>

			<p>
				Startled, Thomas looked up just in time to see the bird flying away with
				his precious hat. "My hat!" he cried out in dismay. Without a second
				thought, Thomas grabbed his oars and began to row after the seabird, his
				heart pounding with worry. He could not imagine going back to the
				village without his lucky charm.
			</p>

			<p>
				The seabird, unaware of the sentimental value of the hat, flew higher
				and higher, leading Thomas on a wild chase across the sea. The old
				fisherman rowed with all his might, but the bird was fast and the hat
				seemed to drift further away with each passing moment.
			</p>

			<p>
				Just as Thomas was about to lose hope, the seabird suddenly dipped low,
				dropping the hat into the water. Thomas gasped, fearing that his beloved
				hat would be lost to the deep. But as luck would have it, the hat
				floated gently on the surface, bobbing up and down with the waves.
			</p>

			<p>
				With a sigh of relief, Thomas rowed quickly to the spot where the hat
				lay and carefully scooped it out of the water. Though it was soaked
				through, the feather still clung to the brim, and the hat was as sturdy
				as ever. Thomas placed it back on his head, feeling the familiar comfort
				it brought.
			</p>

			<p>
				As he made his way back to the village, Thomas couldn't help but laugh
				at the day's adventure. The seabird had given him quite a scare, but in
				the end, his hat—and his luck—remained intact. From that day on,
				whenever Thomas told the story of the mischievous seabird, he would pat
				his hat and say, "This old hat has seen many things, but that was the
				day it truly proved its worth."
			</p>

			<p>
				And so, Thomas continued his fishing, his trusty hat always with him, a
				reminder of the day he chased a seabird across the sea and won back his
				lucky charm.
			</p>

			<hr />

			<footer>© Gibberish AI, inc.</footer>
		</article>
	`,
});
