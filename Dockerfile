FROM node:24-alpine AS base

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    openssl \
    netcat-openbsd \
    bash

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY apps/packages/database/package*.json ./apps/packages/database/
COPY apps/packages/shared/package*.json ./apps/packages/shared/

RUN npm ci

COPY . .

RUN npm run build --workspace ./apps/packages/database && \
    npm run build --workspace ./apps/packages/shared

FROM base AS api-builder
RUN npm run build --workspace ./apps/api
RUN chmod +x docker-entrypoint.sh
EXPOSE 5000
USER node
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "apps/api/dist/api/src/main.js"]

FROM base AS web-builder
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build --workspace ./apps/web
EXPOSE 3000
USER node
CMD ["npm", "start", "--workspace", "apps/web"]