FROM public.ecr.aws/lambda/nodejs:22

COPY package.json package.json
RUN npm install

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "node_modules/@iguhealth/serverless/lib/lambdas/indexing.handler" ]