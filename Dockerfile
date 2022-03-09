FROM node:16-alpine

RUN apk update && apk add --no-cache git openssh-client

#RUN apt-get -y install npm
# Create app directory
WORKDIR /usr/src/app

COPY id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
RUN ssh-keyscan github.com >> ~/.ssh/known_hosts

RUN git clone git@github.com:fclochepin/guessword.git
WORKDIR /usr/src/app/guessword
RUN npm install eslint
RUN npm install --save-dev eslint eslint-config-google
RUN git config --global user.email "fclochepin@gmail.com"
RUN git config --global user.name "fclochepin"
RUN npm install nodemon -g

# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 8080
#CMD ["./start.sh"]
#CMD [ "nodemon", "server.js" ]