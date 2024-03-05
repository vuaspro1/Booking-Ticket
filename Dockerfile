# Build BASE
FROM node:16.15.0-alpine as BASE

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN apk add --no-cache git \
    && yarn install 

# Build Image
FROM node:16.15.0-alpine AS BUILD

WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl \
    && yarn build \
    && rm -rf node_modules \
    && yarn 

# Build production
FROM node:16.15.0-alpine AS PRODUCTION

WORKDIR /app

COPY --from=BUILD /app/package.json /app/yarn.lock /app/next.config.js ./
COPY --from=BUILD /app/src/lib ./src/lib
COPY --from=BUILD /app/node_modules ./node_modules
COPY --from=BUILD /app/.next ./.next
COPY --from=BUILD /app/public ./public

EXPOSE 19045

CMD ["yarn", "start"]
