FROM node:20.9.0-slim  AS node
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn workspaces foreach -ptR --topological-dev --from @iguhealth/admin-app run build

FROM nginx:1.25.3
EXPOSE 80
COPY docker/admin-app/nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/packages/admin-app/build /usr/share/nginx/html