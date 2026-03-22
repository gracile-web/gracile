import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../document.js';
import { topMenu } from '../features/top-menu.js';

export default defineRoute({
	document: (context) =>
		document({ ...context, title: 'Gracile - A Story about Bytes' }),

	template: () => html`
		${topMenu()}

		<h1>A Story about Bytes</h1>

		<article>
			<p>
				In the vast expanse of a digital realm, where circuits intertwined like
				the branches of an ancient forest, a small "Byte" found itself lost.
				This was no ordinary forest, but a labyrinth of computer
				hardware—towering servers, sprawling motherboards, and tangled wires
				that resembled the twisted roots of old oaks. The Byte, a tiny package
				of data, had been separated from its data stream during a routine
				transfer. Now, it drifted aimlessly through this strange and unfamiliar
				terrain.
			</p>

			<p>
				The Byte had no idea how it had gotten here. It only knew that it
				belonged somewhere, part of a larger file that was supposed to reach its
				destination in perfect order. But here, amidst the dense jungle of
				transistors and capacitors, it felt utterly alone.
			</p>

			<p>
				As it wandered, the Byte encountered various inhabitants of the hardware
				forest. First, it stumbled upon a wise old CPU, its core glowing with
				the light of countless computations. The CPU looked down at the Byte
				with a mixture of curiosity and concern.
			</p>

			<p>
				"Little one," the CPU rumbled in a voice that resonated like the hum of
				a power supply, "what brings you to this place?"
			</p>

			<p>
				"I’m lost," the Byte admitted. "I was part of a file being transferred,
				but I got separated. Now, I don’t know where to go."
			</p>

			<p>
				The CPU thought for a moment, its circuits whirring softly. "You must
				find the Bus. It is the path through which all data travels. If you can
				reach the Bus, it will guide you back to where you belong."
			</p>

			<p>
				Thanking the CPU, the Byte continued on its journey, navigating through
				the forest's twisting paths. It passed by the RAM, a bustling
				marketplace where data was constantly exchanged, stored, and retrieved.
				The Byte paused, watching in awe as bits of information flashed and
				flickered like fireflies in the night.
			</p>

			<p>
				But the Byte knew it couldn’t stay. It had to keep moving. Deeper into
				the forest it went, where the shadows grew longer and the hum of
				electricity seemed distant and faint.
			</p>

			<p>
				After what felt like an eternity, the Byte finally spotted a long,
				silvery ribbon stretching across the landscape—the Bus. It pulsed with
				energy, a superhighway for data, and the Byte knew it had found its way.
			</p>

			<p>
				But as the Byte approached the Bus, it encountered a formidable
				obstacle: a Firewall, tall and fierce, its flames crackling with the
				intensity of a thousand security protocols. The Firewall roared,
				blocking the Byte’s path.
			</p>

			<p>
				"You shall not pass!" it bellowed. "Only authorized data may travel this
				Bus!"
			</p>

			<p>
				The Byte trembled but mustered the courage to speak. "Please, I’m just a
				lost Byte, trying to find my way home. I was separated from my file and
				need to return to where I belong."
			</p>

			<p>
				The Firewall's flames flickered uncertainly. It was programmed to
				protect, but it also understood the importance of data integrity. After
				a moment of consideration, the Firewall lowered its defenses slightly,
				just enough for the Byte to slip through.
			</p>

			<p>
				"You may pass," the Firewall said. "But be quick, for the path ahead is
				perilous."
			</p>

			<p>
				The Byte darted onto the Bus, feeling a surge of relief as it was
				carried along at incredible speed. It zipped past other streams of
				data—packets of information destined for various parts of the system.
				The journey was swift, and before long, the Byte saw a familiar sight in
				the distance: the folder it had been meant to join.
			</p>

			<p>
				With a final leap, the Byte rejoined its file, slipping into place as if
				it had never been gone. The file, now complete, continued on its way,
				reaching its destination without a hitch.
			</p>

			<p>
				The Byte, though small and seemingly insignificant, had made a
				difference. It had faced the unknown, navigated the forest of computer
				hardware, and found its way back home. And as the file was opened and
				read by the user, the Byte’s journey was complete, its purpose fulfilled
				in the grand tapestry of the digital world.
			</p>

			<hr />

			<footer>© Gibberish AI, inc.</footer>
		</article>
	`,
});
