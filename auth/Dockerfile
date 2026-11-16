FROM node:20-alpine AS common-builder
WORKDIR /common
COPY common/package.json ./
COPY common/tsconfig.json ./
COPY common/src ./src
RUN npm install && npm run build

FROM node:20-alpine AS deps
WORKDIR /app
COPY --from=common-builder /common /common
COPY auth/package.json ./
RUN npm pkg set dependencies.@ekramp/common="file:/common" \
  && npm install --omit=dev

# Skaffold dev target: ts-node-dev with file sync.
FROM deps AS dev
COPY auth/ .
CMD ["npm", "start"]

FROM deps AS build
COPY auth/ .
RUN npm run build

# Default target: compiled JavaScript, no watcher, non-root.
FROM deps AS prod
ENV NODE_ENV=production
COPY --from=build /app/build ./build
USER node
CMD ["node", "build/index.js"]
