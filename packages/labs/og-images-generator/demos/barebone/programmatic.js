import { generateOgImages } from 'og-images-generator/api';

await generateOgImages({ base: 'pages', out: 'dist', json: 'dist/index.json' });
