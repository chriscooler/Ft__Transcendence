FROM node:21-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g npm@latest

RUN npm install --legacy-peer-deps

RUN npm install bcryptjs --legacy-peer-deps

RUN npm run build

EXPOSE 3000 3001 3002

COPY entrypoint.sh /

RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
