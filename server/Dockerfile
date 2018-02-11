# install node
FROM node:8.9.4-alpine

# make the server folder and cd into it
RUN mkdir -p /server
WORKDIR /server

# copy my yern package info into it
COPY package.json yarn.lock ./
RUN yarn install --non-interactive --silent

# copy the reminader. eg. config/ routes/ model/ ...
COPY . ./
RUN chmod +x ./scripts/wait-for.sh

EXPOSE 8080

CMD ["node", "index.js"]
