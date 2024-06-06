#!/bin/bash

corepack enable
yarn install
yarn workspaces foreach -A -pt --topological-dev run build

# Setup default .env for server.
if [ ! -f ./packages/server/.env ]; then
    cp packages/server/.env.defaults ./packages/server/.env 
fi

