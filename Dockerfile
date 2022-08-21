FROM node:16.17.0-alpine3.16

COPY . /vue_app/

WORKDIR /vue_app

RUN npm install

CMD ["npm", "run", "backend"]
