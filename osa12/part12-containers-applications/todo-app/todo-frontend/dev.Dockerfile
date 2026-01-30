FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV VITE_BACKEND_URL=http://localhost:8080/api/

# npm run dev is the command to start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]