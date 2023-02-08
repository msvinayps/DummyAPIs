FROM cypress/included:9.5.4 as test-env
RUN apt-get update && apt-get install curl -y

WORKDIR /app/cypress-tests
COPY . /app/
RUN --mount=type=secret,id=npmrc,target=/app/.npmrc npm ci
FROM test-env as build-env