#!/bin/bash

corepack enable
yarn install
yarn workspaces foreach -A -pt --topological-dev run build



# Setup default .env for server.
if [ ! -f ./packages/server/.env ]; then
    cp packages/server/.env.defaults ./packages/server/.env 
fi

# Setup default .env for admin app.
if [ ! -f ./packages/admin-app/.env ]; then
    cp packages/admin-app/.env.defaults ./packages/admin-app/.env 
fi

# Loading Terminologies
yarn workspace @iguhealth/server cli terminology load --system iso-4217 iso-3166