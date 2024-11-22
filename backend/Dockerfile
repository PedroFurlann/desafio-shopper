FROM node:18

WORKDIR /app

COPY package*.json ./

COPY ./drivers.json /app/drivers.json

RUN npm install

COPY . .

EXPOSE 3000
