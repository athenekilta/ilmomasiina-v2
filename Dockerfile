FROM node:24-trixie-slim AS base

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
COPY --from=dependencies /app/src/generated ./src/generated
RUN SKIP_ENV_VALIDATION=1 npm run build

FROM base AS runner

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]

FROM base AS worker

ENV NODE_ENV=production

COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json tsconfig.json prisma.config.ts ./
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node src ./src
COPY --from=dependencies --chown=node:node /app/src/generated ./src/generated

USER node
CMD ["./node_modules/.bin/tsx", "src/server/worker.ts"]
