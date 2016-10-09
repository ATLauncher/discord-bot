FROM node:6
MAINTAINER RyanTheAllmighty <ryantheallmighty@atlauncher.com>

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

RUN /usr/local/bin/npm install

COPY . /app

RUN /usr/local/bin/npm run build

VOLUME ["/app/db"]

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]