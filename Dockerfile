FROM node:latest AS builder

WORKDIR /node/src/app

COPY yarn.lock package.json ./

RUN yarn install --frozen-lockfile

RUN yarn build

FROM node:18-alpine

RUN mkdir /app

COPY --from=builder /node/src/app/dist /app/dist
COPY --from=builder /node/src/app/node_modules /app/node_modules

EXPOSE 3000

CMD ["node","dist/main.js"]