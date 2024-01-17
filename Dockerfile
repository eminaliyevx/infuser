FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

COPY . .
 
RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]