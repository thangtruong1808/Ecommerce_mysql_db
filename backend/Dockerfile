FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
COPY shared /shared

RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
