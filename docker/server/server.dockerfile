FROM node:21.6.1-slim
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn workspaces foreach -ptR --topological-dev --from @iguhealth/server run build

COPY docker/server/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

ENV NODE_ENV=production
ENTRYPOINT ["entrypoint"]

CMD ["server"]