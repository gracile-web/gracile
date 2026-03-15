#!/bin/bash

# NOTE: Mac only
killall node

# node --run format:fix
# node --run lint:es:fix

set -e

pnpm install --frozen-lockfile

# TODO: More

# pnpm --prefix docs/website exec playwright install chromium

node --run audit

node --run lint:commit

node --run format

node --run clean

node --run build

node --run lint:es

node --run test:unit

node --run test:integration

pnpm --prefix docs/website run test:smoke

# Lerna…
