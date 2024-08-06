import { URLPattern } from '@gracile/gracile/url-pattern';
import { createGracileMiddleware } from '@gracile/gracile/_internals/server-runtime';

const routes = new Map([
  [
    "/",
    {
      "filePath": "src/routes/(home).ts",
      "pattern": {},
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
      "pattern": {},
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/about/",
    {
      "filePath": "src/routes/about.ts",
      "pattern": {},
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/api/basic/",
    {
      "filePath": "src/routes/api/basic.ts",
      "pattern": {},
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/api/:path*/",
    {
      "filePath": "src/routes/api/[...path].ts",
      "pattern": {},
      "hasParams": true,
      "pageAssets": []
    }
  ],
  [
    "/assets-methods/",
    {
      "filePath": "src/routes/assets-methods.ts",
      "pattern": {},
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/contact/",
    {
      "filePath": "src/routes/contact.ts",
      "pattern": {},
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/foo/bar/",
    {
      "filePath": "src/routes/foo/bar.ts",
      "pattern": {},
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
      "pattern": {},
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/redirect/",
    {
      "filePath": "src/routes/redirect.ts",
      "pattern": {},
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/response-init/",
    {
      "filePath": "src/routes/response-init.ts",
      "pattern": {},
      "hasParams": false,
      "pageAssets": []
    }
  ],
  [
    "/throws/",
    {
      "filePath": "src/routes/throws.ts",
      "pattern": {},
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
['/throws/', () => import('./chunk/throws.js')],
	]
);

const routeAssets = new Map([
  [
    "/404.html",
    "\t<script type=\"module\" crossorigin src=\"/assets/404-YV9WDv3j.js\"></script>\n\n\t<link rel=\"modulepreload\" crossorigin href=\"/assets/document.client-Cca60DWw.js\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/about/",
    "\t<script type=\"module\" crossorigin src=\"/assets/index-YV9WDv3j.js\"></script>\n\n\t<link rel=\"modulepreload\" crossorigin href=\"/assets/document.client-Cca60DWw.js\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/api/:path*/",
    null
  ],
  [
    "/api/basic/",
    null
  ],
  [
    "/assets-methods/",
    "\t<script type=\"module\" crossorigin src=\"/assets/index-M5WC9mrg.js\"></script>\n\n\t<link rel=\"modulepreload\" crossorigin href=\"/assets/document.client-Cca60DWw.js\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/contact/",
    "\t<script type=\"module\" crossorigin src=\"/assets/index-Bo3GL0oc.js\"></script>\n\n\t<link rel=\"modulepreload\" crossorigin href=\"/assets/document.client-Cca60DWw.js\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/foo/bar/",
    "\t<script type=\"module\" crossorigin src=\"/assets/index-BE7fdwSI.js\"></script>\n\n\t<link rel=\"modulepreload\" crossorigin href=\"/assets/document.client-Cca60DWw.js\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/",
    "\t<script type=\"module\" crossorigin src=\"/assets/index-bQOEfuds.js\"></script>\n\n\t<link rel=\"modulepreload\" crossorigin href=\"/assets/document.client-Cca60DWw.js\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/index-C17FHxsp.css\">\n"
  ],
  [
    "/private/",
    "\t<script type=\"module\" crossorigin src=\"/assets/index-N2SDIJ_X.js\"></script>\n\n\t<link rel=\"modulepreload\" crossorigin href=\"/assets/document.client-Cca60DWw.js\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/redirect/",
    null
  ],
  [
    "/response-init/",
    "\t<script type=\"module\" crossorigin src=\"/assets/index-C6DRZtAV.js\"></script>\n\n\t<link rel=\"modulepreload\" crossorigin href=\"/assets/document.client-Cca60DWw.js\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ],
  [
    "/throws/",
    "\t<script type=\"module\" crossorigin src=\"/assets/index-CzX5SsJy.js\"></script>\n\n\t<link rel=\"modulepreload\" crossorigin href=\"/assets/document.client-Cca60DWw.js\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n"
  ]
]);

//  ({ routeAssets, routeImports, routes })

const handler = createGracileMiddleware({
	root: process.cwd(),
	routes,
	routeImports,
	routeAssets,
	serverMode: true,
});

export { handler };
