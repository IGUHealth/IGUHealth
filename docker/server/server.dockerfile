FROM node:21.6.1-bookworm-slim

RUN apt clean
RUN apt update
RUN apt install -y rustc

COPY . /app
WORKDIR /app

RUN yarn install
RUN yarn workspaces foreach -ptR --topological-dev --from @iguhealth/server run build

COPY docker/server/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

ENV NODE_ENV=production
ENTRYPOINT ["entrypoint"]

CMD ["server"]