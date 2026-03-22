import express from 'express';
import { connectOgImagesGenerator } from 'og-images-generator/connect';

const app = express();

app.use(await connectOgImagesGenerator());

app.get('/', (_, res) => {
	res.send(`
		<html style="color-scheme: dark">
			<head>
				<meta property="og:title" content="Express / Connect demo" />
				<meta property="og:description" content="Welcome to my website!" />
			</head>
			<body>
				<h1>Express / Connect demo</h1>
				<p>Welcome Home</p>

				<img src="/og/index.png"/>

				<hr />
				<a href="/nested/foo">Nested</a>
			</body>
		</html>
	`);
});

app.get('/nested/foo', (_, res) => {
	res.send(`
		<html style="color-scheme: dark">
			<head>
				<meta property="og:title" content="Nested page" />
				<meta property="og:description" content="Welcome to my nested page!" />
			</head>
			<body>
				<h1>Express / Connect demo</h1>
				<p>Welcome Home</p>

				<img src="/og/nested/foo.png"/>
				<hr />
				<a href="/">Home</a>
			</body>
		</html>
	`);
});

app.listen(3000, () => {
	console.log('\nServer listening on port http://localhost:3000');
});
