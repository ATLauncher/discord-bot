FROM node:10
MAINTAINER Ryan Dowling <ryan.dowling@atlauncher.com>

RUN mkdir -p /app
WORKDIR /app

COPY package-lock.json /app
COPY package.json /app

RUN /usr/local/bin/npm install --production

COPY . /app

RUN /usr/local/bin/npm run build

VOLUME ["/app/db"]

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]
