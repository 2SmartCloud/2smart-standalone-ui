FROM node:12.5-alpine AS build-stage

RUN apk update && apk add git tzdata

WORKDIR /app

COPY docs docs
COPY public public
COPY src src
COPY .babelrc .
COPY config.js .
COPY package.json .
COPY package-lock.json .
COPY webpack-production.config.js .

# solution for core-js postinstall script hang up
# https://github.com/zloirock/core-js/issues/673#issuecomment-550199917
RUN npm config set unsafe-perm true
RUN npm i
RUN npm run build:silent

FROM node:12.5-alpine

RUN apk update && apk add tzdata

WORKDIR /app

COPY --from=build-stage /app/build build

COPY serve.js .
COPY config.js .
COPY package.json .
COPY create_conf.sh .

RUN npm i --save express path

CMD npm run serve
