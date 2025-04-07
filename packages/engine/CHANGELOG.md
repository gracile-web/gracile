# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.8.2](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.8.2-next.0...@gracile/engine@0.8.2) (2025-04-07)

**Note:** Version bump only for package @gracile/engine

## [0.8.2-next.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.8.1...@gracile/engine@0.8.2-next.0) (2025-04-07)

### Bug Fixes

* reload gracile when vite config is reloaded ([e23a0d0](https://github.com/gracile-web/gracile/commit/e23a0d005b9d6073bcfc5bb59a5282786f884944))
* use user config build output directory ([8e92e1c](https://github.com/gracile-web/gracile/commit/8e92e1c16da6645331dfda1829568b7d735cc44a))

## [0.8.1](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.8.1-next.1...@gracile/engine@0.8.1) (2024-12-22)

**Note:** Version bump only for package @gracile/engine

## [0.8.1-next.1](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.8.1-next.0...@gracile/engine@0.8.1-next.1) (2024-12-22)

### Bug Fixes

* cannot find `gracile:client:routes` only when gracile is built ([e656d66](https://github.com/gracile-web/gracile/commit/e656d660d42b5bdcffa56b16afbf21655bacb5f0))

## [0.8.1-next.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.8.0...@gracile/engine@0.8.1-next.0) (2024-12-22)

### Bug Fixes

* vite 6 breaking change for ssr module hmr, add migration plugin ([b0026e4](https://github.com/gracile-web/gracile/commit/b0026e4db9696b94f7ede31064afb944f825ca84))

# [0.8.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.8.0-next.2...@gracile/engine@0.8.0) (2024-12-22)

**Note:** Version bump only for package @gracile/engine

# [0.8.0-next.2](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.8.0-next.1...@gracile/engine@0.8.0-next.2) (2024-12-21)

### Bug Fixes

* update to vite 5 to 6.x, nanoid vulnerability ([bd16c45](https://github.com/gracile-web/gracile/commit/bd16c45c66d09ec491cda84a09d161747ab89e57))
* vite 6 typings somehow requires to return explicit plugin type for factories ([b264075](https://github.com/gracile-web/gracile/commit/b264075384663f9fdaa0af6800d2b5cf4ba91195))

# [0.8.0-next.1](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.8.0-next.0...@gracile/engine@0.8.0-next.1) (2024-11-03)

### Features

* error when premises are accessed but not enabled ([cf48891](https://github.com/gracile-web/gracile/commit/cf48891aa435505a4c19447526b893ca353cdcb8))

# [0.8.0-next.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.7.1...@gracile/engine@0.8.0-next.0) (2024-10-26)

### Features

* add doctype automatically if missing, align lit template type, add new file route formats ([1c90262](https://github.com/gracile-web/gracile/commit/1c9026208ca1b58ee0e3777929ea0136e5ef715f))

## [0.7.1](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.7.1-next.0...@gracile/engine@0.7.1) (2024-08-28)

**Note:** Version bump only for package @gracile/engine

## [0.7.1-next.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.7.0...@gracile/engine@0.7.1-next.0) (2024-08-28)

### Bug Fixes

* disable better errors for now (causes hydration issues) ([ff241fa](https://github.com/gracile-web/gracile/commit/ff241faada5ccd5343ee97c4ba776ba49ace8496))

# [0.7.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.7.0-next.1...@gracile/engine@0.7.0) (2024-08-25)

**Note:** Version bump only for package @gracile/engine

# [0.7.0-next.1](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.7.0-next.0...@gracile/engine@0.7.0-next.1) (2024-08-25)

### Bug Fixes

* windows paths to posix conversion for code generated routes [#7](https://github.com/gracile-web/gracile/issues/7) ([f7a62d1](https://github.com/gracile-web/gracile/commit/f7a62d1f965ece24b33a3476dfd8df28aa82b7b1))

### Features

* global getter for logger/version ([c76c1ec](https://github.com/gracile-web/gracile/commit/c76c1ec1e5b6104ef5c40695768e84af5167baf9))
* implement better errors all over, new errors pages+refined logic, debounce watch ([522df77](https://github.com/gracile-web/gracile/commit/522df77a035ea756f3fc2e97fe2139580b76ba1c))
* introduce "better errors" package ([09ac5dd](https://github.com/gracile-web/gracile/commit/09ac5dd2d011a84716b2a53a4df996360cad6dee))
* logger options for adapters, organize windows utils, add 500 page support (incomplete) ([dbd01f4](https://github.com/gracile-web/gracile/commit/dbd01f4512fee435de0e28ecdd7bc3e8eb2628c4))

# [0.7.0-next.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.6.0...@gracile/engine@0.7.0-next.0) (2024-08-22)

### Bug Fixes

* collect routes when sibling css-like assets changes ([5784884](https://github.com/gracile-web/gracile/commit/57848841b5992168ae481e4e6e3e7cf244e1a6f5))

### Features

* expose render lit template for tests, rename server consts, remove css helpers from core ([195e1c8](https://github.com/gracile-web/gracile/commit/195e1c86f05b182706e2970b6ade021668ec1d17))
* pages premises (props, doc), ensure route method full async, handler support for static ([87b9c5c](https://github.com/gracile-web/gracile/commit/87b9c5c962cdc075b4bf849fa26e3031ee22d1ac))

# [0.6.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.6.0-next.1...@gracile/engine@0.6.0) (2024-08-14)

**Note:** Version bump only for package @gracile/engine

# [0.6.0-next.1](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.6.0-next.0...@gracile/engine@0.6.0-next.1) (2024-08-14)

### Features

* migrate `printAddressInfos` to `printUrls` ([81a2681](https://github.com/gracile-web/gracile/commit/81a26811fcc0c87b034788fa43ebb21e81987547))

# [0.6.0-next.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.5.0...@gracile/engine@0.6.0-next.0) (2024-08-13)

### Bug Fixes

* 404 assets not linked, sitemap crashing server build, correct error page forwarding in request ([afdcc77](https://github.com/gracile-web/gracile/commit/afdcc770ebc274fff484c93e19b405b7d9ffe8a5))

### Features

* experimental simple routes typings code generation ([bf89de2](https://github.com/gracile-web/gracile/commit/bf89de21ded08c0a6226f7ae5be73b99d77b2564))

# [0.5.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.5.0-next.0...@gracile/engine@0.5.0) (2024-08-11)

**Note:** Version bump only for package @gracile/engine

# [0.5.0-next.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.4.0...@gracile/engine@0.5.0-next.0) (2024-08-11)

### Features

* exports "localhost" env and exclude all test dist files ([9af46de](https://github.com/gracile-web/gracile/commit/9af46de74c613d5a21f4b816f1b0b250b37aaee0))

# [0.4.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.4.0-next.0...@gracile/engine@0.4.0) (2024-08-09)

**Note:** Version bump only for package @gracile/engine

# [0.3.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.3.0-next.0...@gracile/engine@0.3.0) (2024-08-06)

**Note:** Version bump only for package @gracile/engine

## [0.2.2](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.2.2-next.0...@gracile/engine@0.2.2) (2024-08-05)

**Note:** Version bump only for package @gracile/engine

## [0.2.1](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.2.0-next.5...@gracile/engine@0.2.1) (2024-08-05)

**Note:** Version bump only for package @gracile/engine

# [0.2.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.2.0-next.5...@gracile/engine@0.2.0) (2024-08-05)

**Note:** Version bump only for package @gracile/engine

## [0.1.1](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.1.0...@gracile/engine@0.1.1) (2024-06-23)

**Note:** Version bump only for package @gracile/engine

# [0.1.0](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.0.4...@gracile/engine@0.1.0) (2024-06-08)

### Bug Fixes

* bare document crashing static build ([5a206ba](https://github.com/gracile-web/gracile/commit/5a206badd977878d21bb0ff7fe1de307b00496b1))
* deterministic routes codegen ([96ff86d](https://github.com/gracile-web/gracile/commit/96ff86d11cb8b5e64ec548f6585fd8ca2e45edbb))
* move utils, add loggings, refactor tests ([6182f2b](https://github.com/gracile-web/gracile/commit/6182f2bd9694d059ec6d8cd1a57cbc379136d922))
* prefix gracile env, set dev condition for dev cli ([8f96a21](https://github.com/gracile-web/gracile/commit/8f96a2175c6d554a9e21126bdb023248a40c5647))
* use regex instead of cheerio ([6cfc5ab](https://github.com/gracile-web/gracile/commit/6cfc5ab92ec8201ac7cba79a2aed149d1e7f121c))
* use type errors instead of bare errors ([51afce8](https://github.com/gracile-web/gracile/commit/51afce83f241aabed751097a2ff06f31fd5c2d27))

### Features

* add pretty address printer to userland ([4d341a6](https://github.com/gracile-web/gracile/commit/4d341a6225c3c38af713054d82604f08769f2cb5))
* cleaner, less intrusive server api ([301de32](https://github.com/gracile-web/gracile/commit/301de329f0ae91efee471a2db94cfe4baa5fc57a))
* env loader for userland server, extract internal envs ([1370c08](https://github.com/gracile-web/gracile/commit/1370c08c0cabd9416f741f7eb93fc15f4906432e))
* genericize gracile handler to connect like ([d6fd2cf](https://github.com/gracile-web/gracile/commit/d6fd2cfbd9d2e22aa99e9b4cc8763ed099e1643e))
* multi-modal logger for node export conditions ([976153c](https://github.com/gracile-web/gracile/commit/976153cbc44031fa8d67c963d6b38d5e96fec7ee))
* root cli flag, partial route prerender implementation ([3634356](https://github.com/gracile-web/gracile/commit/363435651773d0a98e26e1cb2f08e39163337173))
* support for express server build ([def2671](https://github.com/gracile-web/gracile/commit/def26710abf49f4b74fee61dc9ac9302be62f35d))
* support for locals in handler ([8fce3c3](https://github.com/gracile-web/gracile/commit/8fce3c35b4d23bc0a07d1af4e43673f8cf85a44f))
* support for prerendering route page ([95e60db](https://github.com/gracile-web/gracile/commit/95e60db8cc47dbfc9cf0806f9a4b11977fae469f))
* support for user provided server entrypoint ([fc16377](https://github.com/gracile-web/gracile/commit/fc16377f34b30548c1abd055da5552445790ecbb))
* suppress lit warnings for dev mode ([10643e8](https://github.com/gracile-web/gracile/commit/10643e81aca63b8f4bcde8d8c18c421a1f45f502))

## [0.0.4](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.0.3...@gracile/engine@0.0.4) (2024-05-25)

### Bug Fixes

* revert usage of lit readable ([bde9f4d](https://github.com/gracile-web/gracile/commit/bde9f4dd375fb7ca146cf0f111a6898008ed16fd))
* vite `import.meta.env.(MODE|DEV|PROD)` harmonization ([77c32a2](https://github.com/gracile-web/gracile/commit/77c32a2a60b2e620937c180e87973f6d59a99d84))

## [0.0.3](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.0.2...@gracile/engine@0.0.3) (2024-05-09)

**Note:** Version bump only for package @gracile/engine

## [0.0.2](https://github.com/gracile-web/gracile/compare/@gracile/engine@0.0.1...@gracile/engine@0.0.2) (2024-05-09)

**Note:** Version bump only for package @gracile/engine

## 0.0.1 (2024-05-09)

**Note:** Version bump only for package @gracile/engine
