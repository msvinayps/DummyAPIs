FROM amazon/aws-sam-cli-build-image-nodejs14.x as test-env
RUN npm config set unsafe-perm true
RUN apt-get update && apt-get install docker-compose-plugin

WORKDIR /app/
COPY . /app/
FROM test-env as build-env
