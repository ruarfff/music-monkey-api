FROM keymetrics/pm2:8-alpine

COPY build/server build/server/
COPY package.json .
COPY package-lock.json .
COPY pm2.json .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

EXPOSE 8080

CMD [ "pm2-runtime", "start", "pm2.json" , " --web"]
