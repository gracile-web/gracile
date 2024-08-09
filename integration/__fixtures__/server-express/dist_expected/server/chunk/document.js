import { html } from '@gracile/gracile/server-html';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const document = (options) => html(_a || (_a = __template(['\n	<!doctype html>\n	<html lang="en">\n		<head>\n			<!-- Helpers -->\n\n			<!-- Global assets -->\n			<link\n				rel="stylesheet"\n				href=', '\n			/>\n			<script\n				type="module"\n				src=', '\n			><\/script>\n\n			<!-- Page assets -->\n\n			<!-- SEO and page metadata -->\n			<meta charset="UTF-8" />\n			<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n			<link rel="icon" type="image/svg" href="/favicon.svg" />\n\n			<title>', "</title>\n		</head>\n\n		<body>\n			<route-template-outlet></route-template-outlet>\n		</body>\n	</html>\n"])), new URL("./document.css", import.meta.url).pathname, new URL("./document.client.ts", import.meta.url).pathname, options.title ?? "Hello Gracile");

export { document as d };
