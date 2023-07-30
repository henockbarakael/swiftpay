FROM node:16.14.0-alpine3.15 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./libs/database/prisma prisma

COPY . .

RUN npm run build notification

FROM node:16.14.0-alpine3.15 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY ./libs/database/prisma prisma

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD [ "npm", "run", "start_prod:notification-service"]
