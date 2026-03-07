import { connectOgImagesGenerator } from 'og-images-generator/connect';
import expressToKoa from 'express-to-koa';

/** @type {import('@web/dev-server').DevServerConfig} */
export default {
	middleware: [expressToKoa(await connectOgImagesGenerator())],
};
