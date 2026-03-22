#!/bin/bash

# ---

node --run test:unit

node --run test:integration

node --run test:component

node --run test:e2e
