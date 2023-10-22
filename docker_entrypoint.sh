#!/bin/bash
cd ./packages/server

for word in "$*"; do echo "$word"; done

exec yarn node ./lib/cli.js run $1