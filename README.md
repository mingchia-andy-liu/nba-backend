# NBA Backend


A repo for requesting daily data and schedule.
[Frontend Repo](https://github.com/mingchia-andy-liu/chrome-extension-nba)

## Directory Structure:

* `./db` - `Postgres` DB
* `./server` - `Nodejs` API server for managing the backend

## Tools and Tech:

* `Docker` - Docker for containerized development and production environments
* `docker-compose` - Manage multi-container environments with ease

## Installing and running:

### Starting the platform:
* From the root directory, run `docker-compose build . && docker-compose up`
    * This will pull the base images and bring up the docker containers
* Refer to `docker-compose.yml` to see ports for accessing the servers
* Requests of the form `$IP:8080/api` are sent to the server with `/api`

### Starting individual instances:
* In addition to the `docker-compose.yml`, each service has it's own `Dockerfile`
* Enter into any of the service folders and start the containers manually
