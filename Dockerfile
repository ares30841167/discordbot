FROM node:16.9.1

LABEL maintainer="GUAN-YU CHEN <areschen@outlook.com>"

COPY package.json yarn.lock /discordBot/

WORKDIR /discordBot

RUN yarn global add pm2 && yarn install

COPY assets /discordBot/assets

COPY bot.js /discordBot

USER 1000:1000

ENTRYPOINT [ "node", "bot.js" ]

# docker build . -t discordbot
# docker run -d -it --rm --env-file .env discordbot
