FROM node:lts-slim

ARG FRONTEND_PORT

WORKDIR /app

COPY . .

ARG FRONTEND_PORT

ENV FRONTEND_PORT=$FRONTEND_PORT

EXPOSE $FRONTEND_PORT

RUN npm install -g npm@latest

RUN npm install --legacy-peer-deps

ENTRYPOINT [ "npm", "run", "dev" ]
