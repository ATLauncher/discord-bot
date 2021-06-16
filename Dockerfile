FROM node:14-alpine

LABEL author="Ryan Dowling" maintainer="ryan.dowling@atlauncher.com"

RUN mkdir -p /app \
    && apk add --no-cache git

WORKDIR /app

COPY package-lock.json /app
COPY package.json /app

RUN /usr/local/bin/npm install --unsafe-perm

COPY . /app

RUN /usr/local/bin/npm run build

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]
