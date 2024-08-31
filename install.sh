#!/bin/bash

corepack enable
yarn install
yarn build

# Setup default .env for server.
if [ ! -f ./packages/server/.env ]; then
    cp packages/server/.env.defaults ./packages/server/.env 
fi

# Setup default .env for admin app.
if [ ! -f ./packages/admin-app/.env ]; then
    cp packages/admin-app/.env.defaults ./packages/admin-app/.env 
fi

