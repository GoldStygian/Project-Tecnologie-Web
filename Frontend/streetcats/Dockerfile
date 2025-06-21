# frontend/Dockerfile
FROM node:20-alpine as build

WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4200
CMD ["npm", "run", "start"]