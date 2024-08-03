#!/bin/bash

set -e

pnpm install --frozen-lockfile

# TODO: More tests
# node --run syncpack:lint

pnpm audit signatures

node --run lint:commit

node --run format

node --run build

node --run lint:es

node --run test:unit

node --run test:integration

# Lerna…
