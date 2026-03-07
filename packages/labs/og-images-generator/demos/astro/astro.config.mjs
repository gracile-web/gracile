import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import { astroOgImagesGenerator } from "og-images-generator/astro";

// https://astro.build/config
export default defineConfig({
	site: "http://localhost:4321",

	integrations: [
		mdx(),
		sitemap(),
		//
		astroOgImagesGenerator(),
	],
});
