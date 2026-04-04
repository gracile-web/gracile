#!/bin/bash

# NOTE: Mac only
killall node

# node --run format:fix
# node --run lint:es:fix

set -e

pnpm install --frozen-lockfile

# pnpm --prefix docs/website exec playwright install chromium

node --run audit

node --run lint:commit

node --run format

node --run clean

node --run build:libs

node --run docs:prepare

node --run lint:es

node --run test:unit

node --run test:integration

node --run test:e2e

node --run build:docs

# MARK: Starter projects

pnpm --prefix starter-projects run generate

pnpm --prefix starter-projects run test:smoke

# MARK: Docs

pnpm --prefix docs/website run test:smoke

# Lerna…
