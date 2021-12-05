FROM node:14

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app src
COPY . .

# Install app dependencies
RUN npm install

EXPOSE 4000

CMD [ "npm", "start" ]