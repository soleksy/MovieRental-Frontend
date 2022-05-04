FROM ubuntu:18.04

WORKDIR /home/konszo/app

#Basic tools
RUN apt-get update && apt-get install -y \
    vim \
    git \
    wget \
    zip \
    curl \
    gnupg2 \
    ca-certificates \
    software-properties-common

#NodeJS + NPM
RUN curl -sL "https://deb.nodesource.com/setup_14.x" | bash - &&\
    apt-get update && apt-get install -y \
    nodejs &&\
    npm install -g npm@7.6.2

COPY package.json ./

RUN npm install

COPY . .

#React
EXPOSE 3000

CMD ["npm", "start"]
