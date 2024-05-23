FROM node:18-alpine as builder

RUN npm install -g pnpm

WORKDIR /backend

COPY ./package.json .

RUN pnpm install

COPY . .

RUN pnpm build

FROM node:18-alpine as production

WORKDIR /server

ENV TZ="America/Santiago"

COPY --from=builder /backend/node_modules ./node_modules
COPY --from=builder /backend/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]