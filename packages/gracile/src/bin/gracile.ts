#!/usr/bin/env -S node ./node_modules/@gracile/gracile/dist/bin/helpers/tsx-cli.js --no-warnings=ExperimentalWarning -C production

import './helpers/version.js';

import('@gracile/cli/bin/gracile');
