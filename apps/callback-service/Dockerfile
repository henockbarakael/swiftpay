FROM node:18

WORKDIR /usr/src/app

COPY package.json .

COPY  libs/database/prisma/*  /usr/src/app/libs/database/prisma/

COPY .env /usr/src/app/

RUN npm install

RUN npm run db:generate

COPY . .

RUN npm run build-callback

ENV NODE_ENV=production

CMD ["npm","run", "start:prod-callback"]