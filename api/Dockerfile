FROM node:latest

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci
RUN npm install typescript@latest -g
COPY . .

RUN tsc 

EXPOSE 80

CMD ["node", "dist/index.js"]