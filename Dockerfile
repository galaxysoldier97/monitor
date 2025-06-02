FROM node:18.12-alpine AS builder
LABEL maintainer="it-factory@monaco-telecom.mc"

WORKDIR /usr/src/app

ENV NODE_OPTIONS=--use-openssl-ca
ENV NODE_OPTIONS=--openssl-legacy-provider

# Add the correct env template
ADD .env.template .env

# Copy source code to image
COPY . .
COPY .npmrc /root/.npmrc

# Install dependencies
RUN npm ci

# Build the statics in container con sourcemaps para debug
ENV GENERATE_SOURCEMAP=true 
# Rebuild node-sass
RUN npm rebuild node-sass

RUN npm run docker-build-mt --production --verbose


FROM node:18.12-alpine
LABEL maintainer="it-factory@monaco-telecom.mc"

WORKDIR /usr/src/app

ENV NODE_OPTIONS=--use-openssl-ca
ENV NODE_OPTIONS=--openssl-legacy-provider

COPY --from=builder /usr/src/app/dist ./dist
COPY server.js ./server.js
COPY generateRuntimeEnvs.js ./generateRuntimeEnvs.js
COPY .npmrc /root/.npmrc
ADD .env.template .env
ADD package-server.json package.json

RUN npm install

RUN chown -R node:node /usr/src/app/dist /usr/src/app/generateRuntimeEnvs.js /usr/src/app/server.js

USER node
# Comentado para permitir que sea sobrescrito desde docker-compose
# ENV NODE_ENV=production

# Build app and start server from script
CMD npm run generate-envs-prod && npm run serve