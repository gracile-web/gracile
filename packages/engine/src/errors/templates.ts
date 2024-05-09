import { html } from '@lit-labs/ssr';

export function errorInline(error: Error) {
	return html`<!--  --></a>
  <div data-ssr-error>
    <strong style="color: red">SSR Template error!</strong>
    <details>
      <summary style="user-select: none; cursor: pointer">Stack trace</summary>
      <pre style="overflow: auto">${error.stack}</pre>
    </details>
  </div>`;
}

export function errorPage(error: Error) {
	return html`
		<!--  -->

		<!doctype html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				<title>Error</title>
			</head>
			<body>
				<style>
					html {
						color-scheme: dark;
						font-size: 16px;
						line-height: 1.23rem;
						font-family: system-ui;
					}
					body {
						padding: 1rem;
					}

					pre {
						padding: 1rem;

						overflow-y: auto;
					}
					button {
						font-size: 2rem;
					}

					h1 {
						color: tomato;
					}
				</style>

				<main>
					<h1>😵 An error has occurred!</h1>
					<button id="reload">Reload</button>
					<!--  -->
					<hr />

					<pre>${error.stack}</pre>
					<!-- <pre>$ {e.name}</pre> -->
					<!-- <pre>$ {e.message}</pre> -->
					<!-- <pre>$ {e.cause}</pre> -->
					<hr />
				</main>

				<script>
					reload.addEventListener('click', () => document.location.reload());
				</script>
			</body>
		</html>
	`;
}
