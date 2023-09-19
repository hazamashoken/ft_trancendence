# Base image
FROM node:18 as development

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./package*.json ./

# install nest/cli as global
RUN npm i -g @nestjs/cli

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

FROM node:18 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN npm install --only=production

COPY . .

COPY --from=development ./dist ./dist

EXPOSE 3000

# Start the server using the production build
# CMD [ "node", "dist/main.js" ]
