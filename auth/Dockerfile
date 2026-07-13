FROM node:20-alpine AS common-builder
WORKDIR /common
COPY common/package.json ./
COPY common/tsconfig.json ./
COPY common/src ./src
RUN npm install && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=common-builder /common /common
COPY auth/package.json ./
RUN npm pkg set dependencies.@ekramp/common="file:/common" \
  && npm install --omit=dev
COPY auth/ .
CMD ["npm", "start"]
