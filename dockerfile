FROM node:19.6.0

COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn workspaces foreach -ptR --topological-dev --from @iguhealth/server run build

COPY docker_entrypoint.sh /usr/local/bin/docker_entrypoint
RUN chmod +x /usr/local/bin/docker_entrypoint

ENV NODE_ENV=production
ENTRYPOINT ["docker_entrypoint"]

CMD ["server"]