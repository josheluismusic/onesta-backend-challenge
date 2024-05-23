## Stage of building
FROM node:18-alpine as builder

# Install PNPM
RUN npm install -g pnpm

# Stage 1: Build backend
WORKDIR /backend

COPY ./package.json .

RUN pnpm install

COPY . .

RUN pnpm build

## Production Stage: Run the app
FROM node:18-alpine as production

WORKDIR /server

ENV TZ="America/Santiago"

COPY --from=builder /backend/node_modules ./node_modules
COPY --from=builder /backend/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]