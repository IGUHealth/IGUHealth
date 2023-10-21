FROM node:19.6.0

COPY . /app
WORKDIR /app
RUN yarn --version
RUN yarn workspaces foreach -ptR --from @iguhealth/server run build
WORKDIR /app/packages/server
CMD yarn node ./lib/cli.js run server

# ENTRYPOINT ["yarn" "node" "./lib/cli.js"]