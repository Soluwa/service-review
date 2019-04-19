FROM node

RUN mkdir /app
COPY ./package.json /app
COPY ./.npmrc /app
COPY /dist /app

COPY /node_modules /app/node_modules
# RUN npm install

WORKDIR /app
ENV NODE_ENV local
ENV PORT 3003

EXPOSE 3003
CMD [ "node", "index.js" ] 
