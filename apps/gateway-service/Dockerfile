FROM node:18

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

RUN npm run db:generate

COPY . .

RUN npm run build-gateway

ENV NODE_ENV=production

CMD ["npm","run", "start:prod-gateway"]