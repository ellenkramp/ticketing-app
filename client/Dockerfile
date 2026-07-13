FROM node:20-alpine AS deps
WORKDIR /app
COPY client/package.json client/package-lock.json* ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY client/ .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_STRIPE_KEY
ENV NEXT_PUBLIC_STRIPE_KEY=$NEXT_PUBLIC_STRIPE_KEY
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
