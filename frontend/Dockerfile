FROM node:18-alpine as development
WORKDIR /app

COPY ./app/package.json ./app/package-lock.json ./
COPY ./app .
RUN npm run build

FROM node:18-alpine as production
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 8080
ENTRYPOINT ["npm", "start"]