FROM cypress/included:9.5.4 as test-env
RUN apt-get update && apt-get install curl -y

WORKDIR /app/
COPY . /app/
FROM test-env as build-env
