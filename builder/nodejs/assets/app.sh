#!/bin/sh
set -eux
export NODE_PATH=$(npm root -g)
node /app.js

