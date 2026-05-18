// Lightweight commit-message hygiene gate.
//
// Inspired by the "seven rules of a great Git commit message" (cbea.ms/git-commit/),
// minus the parts that aren't reliably lintable:
//   1. Separate subject from body with a blank line .............. body-leading-blank, footer-leading-blank
//   2. Limit the subject line to ~50 characters .................. header-max-length (relaxed to 72 — humane)
//   3. Capitalize the subject line ............................... subject-case
//   4. Do not end the subject line with a period ................. subject-full-stop
//   5. Use the imperative mood in the subject line ............... NOT lintable reliably (skipped)
//   6. Wrap the body at 72 characters ............................ body-max-line-length
//   7. Use the body to explain what and why vs. how .............. NOT lintable (skipped)
//
// Intentionally NOT extending @commitlint/config-conventional — release intent
// is now driven by Changesets, not commit-message parsing.

/** @type {import('@commitlint/types').UserConfig} */
export default {
	// Treat the entire first line as the subject — no `type(scope): subject`
	// conventional-commits structure is assumed or required.
	parserPreset: {
		parserOpts: {
			headerPattern: /^(.*)$/,
			headerCorrespondence: ['subject'],
		},
	},
	rules: {
		// Rule 1
		'body-leading-blank': [2, 'always'],
		'footer-leading-blank': [2, 'always'],

		// Rule 2 — relaxed from 50 → 72. Subject still has to fit on one terminal line.
		'header-max-length': [2, 'always', 72],
		'header-trim': [2, 'always'],

		// Rule 3 — accept any reasonable capitalised style, but reject all-lowercase
		// "fix bug" subjects. Allowed: "Fix bug", "Fix Bug", "FIX BUG".
		'subject-case': [
			2,
			'never',
			['lower-case', 'pascal-case', 'snake-case', 'kebab-case'],
		],
		'subject-empty': [2, 'never'],

		// Rule 4
		'subject-full-stop': [2, 'never', '.'],

		// Rule 6
		'body-max-line-length': [2, 'always', 72],
	},
};
