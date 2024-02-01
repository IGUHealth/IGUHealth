FROM node:20.9.0-slim  as node
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn workspaces foreach -ptR --topological-dev --from @iguhealth/admin-app run build

FROM nginx
EXPOSE 80
COPY docker/admin-app/nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/packages/admin-app/build /usr/share/nginx/html