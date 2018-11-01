FROM mysql:8.0.3

# create a database with the defined parameters
ENV MYSQL_ROOT_PASSWORD="changeme"
ENV MYSQL_DATABASE="mydb"

# copy init to the init db directory inside contaienr
COPY init_db.sql ./docker-entrypoint-initdb.d


# re-set the entry point
ENTRYPOINT ["docker-entrypoint.sh"]

# run the command
CMD ["mysqld"]
