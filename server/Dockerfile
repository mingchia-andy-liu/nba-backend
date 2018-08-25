# install node
FROM node:10-alpine

# make the server folder and cd into it

RUN mkdir -p /usr/app
WORKDIR /usr/app

# copy my yern package info into it
COPY package.json yarn.lock ./
RUN yarn --non-interactive --silent

# copy the reminader. eg. config/ routes/ model/ ...
COPY . .
RUN chmod +x ./scripts/wait-for.sh

CMD ["node", "start"]
