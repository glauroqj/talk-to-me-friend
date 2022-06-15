FROM node:14.17-alpine

# configure localtime
ENV TZ=America/Sao_Paulo
RUN apk add --update --no-cache tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
  echo $TZ > /etc/timezone

ARG FOLDER_NAME
ENV FOLDER_NAME ${FOLDER_NAME}

WORKDIR /app
ADD ./ /app


RUN npm install --unsafe-perm -g full-icu@1.4.0 && \
  chmod +x /usr/local/bin/yarn

# ENTRYPOINT cd client && yarn && yarn build && cd ../server && yarn && yarn dev

RUN echo "${FOLDER_NAME}"

ENTRYPOINT cd ${FOLDER_NAME} && yarn && yarn dev

# DOC: https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
# < BUILD DOCKER IMAGE > docker build -t <your username>/node-web-app .
# < SHOW ALL DOCKER IMAGES > docker images
# < RUN THE IMAGE > docker run -p 49160:8080 -d <your username>/node-web-app
# < Enter the container > docker exec -it <container id> sh
