import { URLPattern } from '@gracile/gracile/url-pattern';
import { createGracileHandler } from '@gracile/gracile/_internals/server-runtime';
import { createLogger } from '@gracile/gracile/_internals/logger';

const routes = new Map([
  [
    "/",
    {
      "filePath": "src/routes/(home).ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": [
        "src/routes/(home).client.ts",
        "src/routes/(home).css"
      ]
    }
  ],
  [
    "/404/",
    {
      "filePath": "src/routes/404.ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/about/",
    {
      "filePath": "src/routes/about.ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/api/basic/",
    {
      "filePath": "src/routes/api/basic.ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/api/:path*/",
    {
      "filePath": "src/routes/api/[...path].ts",
      "pattern": null,
      "hasParams": true,
      "pageAssets": []
    }
  ],
  [
    "/assets-methods/",
    {
      "filePath": "src/routes/assets-methods.ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/contact/",
    {
      "filePath": "src/routes/contact.ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/foo/bar/",
    {
      "filePath": "src/routes/foo/bar.ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": [
        "src/routes/foo/bar.client.ts"
      ]
    }
  ],
  [
    "/private/",
    {
      "filePath": "src/routes/private/index.ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/redirect/",
    {
      "filePath": "src/routes/redirect.ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/response-init/",
    {
      "filePath": "src/routes/response-init.ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/route-premises/",
    {
      "filePath": "src/routes/route-premises.ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/template-failure/",
    {
      "filePath": "src/routes/template-failure.ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/throws/",
    {
      "filePath": "src/routes/throws.ts",
      "pattern": null,
      "hasParams": false,
      "pageAssets": []
    }
  ]
]);
routes.forEach((route, pattern) => {
	route.pattern = new URLPattern(pattern, 'http://gracile');
});

const routeImports = new Map(
	[
		['/', () => import('./chunk/(home).js')],
		['/404/', () => import('./chunk/404.js')],
		['/about/', () => import('./chunk/about.js')],
		['/api/basic/', () => import('./chunk/basic.js')],
		['/api/:path*/', () => import('./chunk/_...path_.js')],
		['/assets-methods/', () => import('./chunk/assets-methods.js')],
		['/contact/', () => import('./chunk/contact.js')],
		['/foo/bar/', () => import('./chunk/bar.js')],
		['/private/', () => import('./chunk/index.js')],
		['/redirect/', () => import('./chunk/redirect.js')],
		['/response-init/', () => import('./chunk/response-init.js')],
		['/route-premises/', () => import('./chunk/route-premises.js')],
		['/template-failure/', () => import('./chunk/template-failure.js')],
		['/throws/', () => import('./chunk/throws.js')],
	]
);

const routeAssets = new Map([
  [
    "/404/",
    " <script type=\"module\" crossorigin src=\"/assets/document.client-CMOVr55R.js\"></script>\n\n <link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/about/",
    " <script type=\"module\" crossorigin src=\"/assets/document.client-CMOVr55R.js\"></script>\n\n <link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/assets-methods/",
    " <script type=\"module\" crossorigin src=\"/assets/document.client-CMOVr55R.js\"></script>\n\n <link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/contact/",
    " <script type=\"module\" crossorigin src=\"/assets/document.client-CMOVr55R.js\"></script>\n\n <link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/foo/bar/",
    "\t<script type=\"module\" crossorigin src=\"/assets/index-DoNyqiqH.js\"></script>\n\n\t<link rel=\"modulepreload\" crossorigin href=\"/assets/document.client-CMOVr55R.js\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/",
    "\t<script type=\"module\" crossorigin src=\"/assets/index-CKZBGRGy.js\"></script>\n\n\t<link rel=\"modulepreload\" crossorigin href=\"/assets/document.client-CMOVr55R.js\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/index-C17FHxsp.css\">\n"
  ],
  [
    "/private/",
    " <script type=\"module\" crossorigin src=\"/assets/document.client-CMOVr55R.js\"></script>\n\n <link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/response-init/",
    " <script type=\"module\" crossorigin src=\"/assets/document.client-CMOVr55R.js\"></script>\n\n <link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/route-premises/",
    " <script type=\"module\" crossorigin src=\"/assets/document.client-CMOVr55R.js\"></script>\n\n <link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/template-failure/",
    " <script type=\"module\" crossorigin src=\"/assets/document.client-CMOVr55R.js\"></script>\n\n <link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/throws/",
    " <script type=\"module\" crossorigin src=\"/assets/document.client-CMOVr55R.js\"></script>\n\n <link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ]
]);

createLogger();

const handler = createGracileHandler({
	root: process.cwd(),
	routes,
	routeImports,
	routeAssets,
	serverMode: true,
	gracileConfig: {
  "output": "server",
  "dev": {},
  "pages": {
    "premises": {
      "expose": true,
      "include": [
        "**/route-premises.ts"
      ]
    }
  }
}
});

export { handler };
