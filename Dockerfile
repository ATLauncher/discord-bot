FROM node:14-alpine

LABEL author="Ryan Dowling" maintainer="ryan.dowling@atlauncher.com"

RUN mkdir -p /app \
    && apk add --no-cache git

WORKDIR /app

COPY package-lock.json /app
COPY package.json /app
COPY patches /app

RUN /usr/local/bin/npm install

COPY . /app

RUN /usr/local/bin/npm run build

ENV NODE_ENV=production

VOLUME ["/app/db"]

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]
