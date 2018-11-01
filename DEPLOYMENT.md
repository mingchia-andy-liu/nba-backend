# deployment

## Log into AWS
1. creates a user in IAM
    - this is for allowing aws-cli access, instead of inputing master password
1. `aws configure` with new user crediential
1. Enters push command For example: `$(aws ecr get-login --no-include-email --region us-east-2)`

## Push to ECS repositories
1. Follow **Log into AWS**
1. Build your Docker containers
    1. `docker tag nba-backend:latest <aws-ecr-url>/<repositories>:<tag>`
1. Docker push `docker push <aws-ecr-url>/<repositories>:<tag>`


## Install dependencies
1. Go to the [aws](https://docs.aws.amazon.com/quickstarts/latest/vmlaunch/step-2-connect-to-instance.html#sshclient) to see **connect to instance**
    1. `$ chmod 400 my-key-pair.pem`
    1. `$ ssh -i /path/my-key-pair.pem ec2-user@public_dns_name`
        - default user name is `ec2-user`

Once you are in the instance
#### Install `Docker`
1. `sudo yum update`
1. `sudo yum install -y docker`
1. `sudo service docker start`
1. `sudo usermod -a -G docker ec2-user`
You need to re-ssh in the instance for the user configuration to take effect


#### Install `Docker-compose`
1. Go to the [Docker](https://docs.docker.com/compose/install/#install-compose) to install `Compose`
    1. `$ sudo curl -L "https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
        1. Use the latest version
    1. `sudo chmod +x /usr/local/bin/docker-compose`

## Deployment
1. Follow **Log into AWS**
1. Copy `docker-compose.prod.yml` to the instance
1. Pull repositories: `$ docker pull <aws-ecr-url>:<repository-name>:<tag>`
1. Starts the instance `$ docker-compose up`
