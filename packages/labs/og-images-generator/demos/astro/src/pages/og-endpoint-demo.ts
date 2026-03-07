// WARNING: Don't use this in production without careful DDOS prevention like:
// Caching, avoiding non-deterministic / out of your control parameters…

import { renderOgImage, loadUserConfig } from "og-images-generator/api";

import type { APIRoute } from "astro";
import { getEntryBySlug } from "astro:content";

export const GET: APIRoute = async (/* { params, request } */) => {
	const pageInfos = await getEntryBySlug("blog", "first-post");

	const config = await loadUserConfig();
	const image = await renderOgImage(config, {
		path: "/endpoint-demo",
		meta: {
			tags: {
				"og:title": pageInfos.data.title,
				"og:description": pageInfos.data.description,
			},
		},
	});

	return new Response(image);
};
