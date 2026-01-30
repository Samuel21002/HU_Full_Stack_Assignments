FROM node:20.9.0-bullseye-slim

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci --only=production

ENV PORT=3000

USER node

CMD npm start