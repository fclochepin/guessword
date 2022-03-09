FROM node:10

# Create app directory
WORKDIR /usr/src/app

RUN git clone https://github.com/fclochepin/guessword.git
RUN npm install
RUN npm install nodemon -g
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "nodemon", "server.js" ]