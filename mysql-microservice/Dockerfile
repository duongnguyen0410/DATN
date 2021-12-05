## Pull the mysql:5.7 image
FROM mysql:5.7

# database = test and password for root = password
ENV MYSQL_DATABASE=internship \
    MYSQL_ROOT_PASSWORD=password

# when container will be started, we'll have `test` database created with this schema
COPY ./init/init.sql /docker-entrypoint-initdb.d/