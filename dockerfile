FROM node:19.6.0

COPY . /app
WORKDIR /app
RUN yarn install --immutable --immutable-cache
RUN yarn workspaces foreach -ptR --from @iguhealth/server run build

COPY docker_entrypoint.sh /usr/local/bin/docker_entrypoint
RUN chmod +x /usr/local/bin/docker_entrypoint
ENTRYPOINT ["docker_entrypoint"]

CMD ["server"]