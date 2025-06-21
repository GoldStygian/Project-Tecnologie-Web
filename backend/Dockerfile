FROM node:20-alpine

RUN apk add --no-cache python3 make g++ sqlite

WORKDIR /app/backend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
