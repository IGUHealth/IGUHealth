FROM alpine:3.21.3 AS layer-copy 

RUN mkdir -p /opt

COPY ./layers/lambda-parameter-extension:17.zip layer.zip
RUN unzip layer.zip -d /opt
RUN rm layer.zip

FROM public.ecr.aws/lambda/nodejs:22

COPY --from=layer-copy /opt /opt
COPY docker/package.json package.json
RUN npm install --ignore-scripts

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "node_modules/@iguhealth/serverless/lib/lambdas/subscription-v1.handler" ]