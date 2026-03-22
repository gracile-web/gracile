// NOTE: Response.redirect not working in Web Container

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../../document.js';

let myData = 'untouched';

type Props = {
	success: boolean;
	message: string | null;
	myData: unknown;
};

export default defineRoute({
	handler: {
		GET: () => {
			const props: Props = { success: true, message: null, myData };
			return props;
		},

		POST: async (context) => {
			const formData = await context.request.formData();

			const props: Props = { success: false, message: null, myData };

			const myFieldValue = formData.get('my_field')?.toString();
			if (!myFieldValue) {
				context.responseInit.status = 400;
				props.message = 'Missing field.';
			} else {
				props.success = true;
				myData = myFieldValue;
				props.myData = myData;
			}

			if (formData.get('format') === 'json') {
				return Response.json(props, context.responseInit);
			}
			// TIP: No-JS fallback
			if (props.success) {
				return Response.redirect(context.url, 303);
			}

			props.success = false;
			// IMPORTANT: We want the user data to be repopulated in the page after a failed `POST`.
			return props;
		},
	},

	document: (context) => document({ ...context, title: 'Form with JS' }),

	template: (context) => {
		console.log(context);

		return html`
			<main class="shell-content-centered">
				<form-augmented>
					<form method="post">
						<input type="text" value=${myData} name="my_field" />
						<button>Change field value</button>
					</form>

					<hr />
					<pre id="debugger">${JSON.stringify(context.props, null, 2)}</pre>
				</form-augmented>

				<hr />
			</main>
		`;
	},
});
