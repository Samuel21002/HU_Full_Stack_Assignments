FROM node:20-alpine

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

COPY --chown=node:node package*.json ./

USER node

RUN npm ci --omit=dev

COPY --chown=node:node . .

CMD ["npm", "start"]
