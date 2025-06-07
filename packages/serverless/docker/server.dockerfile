FROM public.ecr.aws/lambda/nodejs:22

COPY docker/package.json package.json
RUN npm install --ignore-scripts

COPY ./lib/lambdas/server.js node_modules/@iguhealth/serverless/lib/lambdas/server.js

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "node_modules/@iguhealth/serverless/lib/lambdas/server.handler" ]