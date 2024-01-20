FROM node:21
RUN mkdir /app
WORKDIR /app
ADD . .
ENV NODE_ENV=production
RUN npm install
EXPOSE 3000
CMD node server.js