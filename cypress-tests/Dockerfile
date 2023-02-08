FROM amazon/aws-sam-cli-build-image-nodejs14.x as test-env
RUN npm config set unsafe-perm true

WORKDIR /app/
COPY . /app/
FROM test-env as build-env
