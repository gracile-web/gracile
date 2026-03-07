// NOTE: Response.redirect not working in Web Container

import { defineRoute } from '@gracile/gracile/route';
import { html } from 'lit';

import { document } from '../../document.js';

// -----------------------------------------------------------------------------

let achievementsDb = [{ name: 'initial record', coolnessFactor: 5 }];

// TIP: Just a bit of optional setup, for easier refactoring and to keep a bird-eye view.
const FORM = {
	fields: {
		action: 'action',

		achievementName: 'achievement_name',
		coolnessFactor: 'coolness_factor',
		filterByName: 'filter_by_name',
	},
	actions: {
		deleteAll: 'delete_all',
		add: 'add',
	},
} as const;

// -----------------------------------------------------------------------------

export default defineRoute({
	// NOTE: Order matters! Handlers return inferred props. for doc/page afterward.
	handler: {
		GET: (context) => {
			const filterByName = context.url.searchParams.get(
				FORM.fields.filterByName,
			);

			if (filterByName) {
				const filtered = achievementsDb.filter((achievement) =>
					achievement.name.includes(filterByName),
				);
				return { achievements: filtered, filterByName } as const;
			}

			// TIP: Clean-up empty search parameter
			if (filterByName === '') {
				context.url.searchParams.delete(FORM.fields.filterByName);
				return Response.redirect(context.url);
			}

			return { achievements: achievementsDb, filterByName } as const;
		},

		POST: async (context) => {
			const formData = await context.request.formData();

			const action = formData.get(FORM.fields.action)?.toString();
			switch (action) {
				case FORM.actions.add:
					{
						const name = formData.get(FORM.fields.achievementName)?.toString();
						const coolnessFactor = formData
							.get(FORM.fields.coolnessFactor)
							?.toString();

						// NOTE: Basic form data shape validation.
						if (name && coolnessFactor && name.length >= 3) {
							achievementsDb.push({
								name,
								coolnessFactor: Number(coolnessFactor),
							});
						} else {
							context.responseInit.status = 400;
							// IMPORTANT: We want the user data to be repopulated in the page after a failed `POST`.
							return {
								success: false,
								message: 'Wrong form input.',
								achievements: achievementsDb,
								payload: { name, coolnessFactor },
							} as const;
						}
					}
					break;

				case FORM.actions.deleteAll:
					achievementsDb = [];
					break;

				default:
					context.responseInit.status = 422;
					return {
						success: false,
						message: 'Unknown form action.',
						achievements: achievementsDb,
					} as const;
			}

			// TIP: Using the "POST/Redirect/GET" pattern to avoid duplicate form submissions
			return Response.redirect(context.url, 303);
		},
	},

	document: (context) => document({ ...context, title: 'Form without JS' }),

	template: (context) => html`
		<main class="shell-content-centered">
			<h1>Achievements manager</h1>

			<hr />
			<p>
				<small
					>Note that you may have issues with this route that use
					<code>Response.redirect</code> inside Web Containers environments
					(StackBlitz, Codesandbox, the Gracile playground…).</small
				>
			</p>
			<hr />

			<form method="post">
				<input
					type="hidden"
					name=${FORM.fields.action}
					value=${FORM.actions.add}
				/>
				<input
					type="text"
					name=${FORM.fields.achievementName}
					value=${context.props.POST?.payload?.name ?? ''}
					required
				/>
				<input
					type="number"
					value=${context.props.POST?.payload?.coolnessFactor ?? 1}
					name=${FORM.fields.coolnessFactor}
				/>

				<footer>
					<button>Add an achievement</button>
					<small>3 chars length min.</small>

					${context.props.POST?.success === false
						? html`
								<strong>Something went wrong!</strong>

								${context.props.POST?.message
									? html` <strong>${context.props.POST.message}</strong> `
									: null}
							`
						: null}
				</footer>
			</form>

			<hr />

			<form>
				<input
					type="text"
					name=${FORM.fields.filterByName}
					value=${context.props.GET?.filterByName ?? ''}
				/>
				<button>Filter by name</button>
			</form>
			<ul>
				${(context.props.GET || context.props.POST)?.achievements?.map(
					(achievement) => html`
						<li>
							<!--  -->
							<em>${achievement.coolnessFactor}</em> -
							<strong>${achievement.name}</strong>
						</li>
					`,
				)}
			</ul>

			<hr />

			<form method="post">
				<input
					type="hidden"
					name=${FORM.fields.action}
					value=${FORM.actions.deleteAll}
				/>
				<button>Delete all</button>
			</form>

			<hr />

			<footer>
				<pre>${JSON.stringify({ props: context.props }, null, 2)}</pre>
			</footer>
		</main>
	`,
});
