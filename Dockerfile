
FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY ./prisma ./prisma



RUN npm install -g @nestjs/cli 
RUN npx prisma generate


COPY . .

RUN npm run build

EXPOSE 8080


CMD ["npm", "run","start:docker"]
