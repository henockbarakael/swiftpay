FROM node:18

WORKDIR /usr/src/app

COPY package.json .

COPY  libs/database/prisma/*  /usr/src/app/libs/database/prisma/

COPY .env /usr/src/app/

ENV DB_HOST=161.35.161.32

ENV DB_PORT=3306

ENV DB_NAME=agregator_db

ENV DB_USER=agregator

ENV DB_PASSWORD=e5J^53&5sH8f

ENV DATABASE_URL=mysql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=public

ENV KAFKA_BROKERS=161.35.161.18:9092,161.35.168.245:9092,161.35.165.31:9092

RUN npm install

RUN npm run db:generate

COPY . .

RUN npm run build-callback

ENV NODE_ENV=production

CMD ["npm","run", "start:prod-callback"]