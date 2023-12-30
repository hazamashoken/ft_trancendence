# Base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./app/package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application to the working directory
COPY ./app .

# Creates a ".next" folder with the production build
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]