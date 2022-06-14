FROM node:16.13.1

# configure localtime
ENV TZ=America/Sao_Paulo
RUN apk add --update --no-cache tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
  echo $TZ > /etc/timezone


WORKDIR /app
ADD ./ /app

# Installing full-icu, pm2 and yarn
# full-icu: support all locales of the world
# yarn: used to install owr dependencies and run some commands
RUN npm install --unsafe-perm -g full-icu@1.4.0 && \
  yarn global add lerna@4.0.0 && \
  chmod +x /usr/local/bin/yarn

# ENV PM2_PUBLIC_KEY 9gh2ksqtlob8fdg
# ENV PM2_SECRET_KEY p1aa3xqu3uwyr2s

# Every time the image runs, we:
# 1. Remove our node_modules to ensure that every package will be fresh installed
# 2. Run yarn to install our dependencies
# 3. Run startDev that will build and start our application

RUN cd client && yarn && yarn dev && cd ../server && yarn

ENTRYPOINT yarn dev


# DOC: https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
# < BUILD DOCKER IMAGE > docker build -t <your username>/node-web-app .
# < SHOW ALL DOCKER IMAGES > docker images
# < RUN THE IMAGE > docker run -p 49160:8080 -d <your username>/node-web-app
# < Enter the container > docker exec -it <container id> sh
