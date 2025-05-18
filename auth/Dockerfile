FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 3001

CMD ["node", "dist/main"]


