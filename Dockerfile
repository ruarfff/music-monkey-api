FROM node:8.11.4

WORKDIR /usr/app

COPY package.json .
RUN yarn install --silent

COPY . .
