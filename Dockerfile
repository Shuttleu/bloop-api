FROM node:21
RUN mkdir /app
WORKDIR /app
ADD package* .
ENV NODE_ENV=production
RUN npm install
ADD . .
EXPOSE 3000
CMD node server.js