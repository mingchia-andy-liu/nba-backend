# NBA Backend


A repo for requesting api endpoints.
[Frontend Repo](https://github.com/mingchia-andy-liu/chrome-extension-nba)

## Directory Structure:

* `./db` - `MySQL` DB
* `./server` - `Nodejs` API server for managing the backend

## Application
* Requests of the form `$IP:8080/api` are sent to the server with `/api`
* `localhost:8081` is the adminier service that provides interface to intereact with `./db`


## Tools and Tech:

* `Docker` - Docker for containerized development and production environments
* `Docker-compose` - Manage multi-container environments with ease

## Installing and running:
The application is structured to run with `Docker`. So you need to install `Docker` and `Docker-compose` first.

### Commands to run the app:
* From the root directory, run `docker-compose build && docker-compose up`
    * This will pull the base images and bring up the docker containers
* Run `docker-compose stop && docker-compose down` to stop the running services and remove containers/networks/images/volumn

### Starting individual instances:
* In addition to the `docker-compose.yml`, each service has it's own `Dockerfile`
* Enter into any of the service folders and start the containers manually
