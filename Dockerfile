FROM node

RUN apt-get update && \
    apt-get upgrade -y

RUN yarn global add pm2

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

COPY package.json .
RUN yarn

COPY . .
COPY --chown=node:node . .

RUN chown node:1000 -R /home/node/app

USER node

CMD ["yarn", "dev"]
