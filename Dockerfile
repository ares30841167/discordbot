FROM node:18.17.0-alpine3.17

LABEL maintainer="GUAN-YU CHEN <areschen@outlook.com>"

RUN apk add make libtool autoconf automake gcc g++ libc-dev python3

COPY package.json yarn.lock /discordbot/

WORKDIR /discordbot

RUN yarn global add pm2 && yarn install

COPY assets /discordbot/assets

COPY src /discordbot/src

USER 1000:1000

ENTRYPOINT [ "node", "src/main.js" ]

# docker build . -t discordbot
# docker run -d -it --rm --env-file .env discordbot
