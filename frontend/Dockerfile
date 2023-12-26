# Base image
FROM node:18 as development

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./app/package.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application to the working directory
COPY ./app .

# Creates a ".next" folder with the production build
RUN npm run build

FROM node:18 as production
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

# Copy the rest of the application to the working directory
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "run", "start"]