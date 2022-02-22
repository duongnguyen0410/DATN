# Big Exercises Web technical

### Installation

Requires

> [Node.js](https://nodejs.org/) v12.7.0+ recommend

> [MySQL](https://www.mysql.com/) but in my project i used [MySQL in XAMPP](https://www.apachefriends.org/index.html) v5.6.x to run.

> [Docker](https://docs.docker.com/) You can find it here

> [Docker Compose](https://docs.docker.com/) Recommend for Docker project

Install project in local host

```sh
$ npm install
```

By default, database name is: internship

Before start server, you must setup for MySQL with at least data default in ~/mysql-microservice/init/init.sql file.

Copy and paste data into file and run in SQL query tab. You can login with accout: admin - admin (admin role)

Run server

```sh
$ npm run dev
```

### Docker commands

Note: From second time, you need remove old container by command

```sh
$ docker stop project-mysql-microservice project-app-microservice
$ docker container rm project-mysql-microservice project-app-microservice
$ docker image rm project-docker-mysql project-docker-application
```

MySQL service

Các collection, table,.. đều phải để định dạng là utf8_unicode_ci

```sh
$ cd mysql-microservice
$ docker build -t project-docker-mysql .
$ docker run -d --publish 6603:3307 --mount type=bind,source="$(pwd)"/handle-data,destination=/var/lib/mysql --name project-mysql-microservice project-docker-mysql
```

App service

```sh
$ cd ..
$ docker build --rm -f Dockerfile -t project-docker-application .
$ docker run -d --publish 4000:4000 -e MYSQL_USER='root' -e MYSQL_PASSWORD='password' -e MYSQL_DATABASE='internship' -e MYSQL_HOST='172.17.0.2' --link project-mysql-microservice:db --name=project-app-microservice project-docker-application
```

### Docker-Compose commands

```sh
$ npm install
$ docker-compose build
$ docker-compose up
$ # For first build and run, after build success please ^C to cancel and run again
$ docker-compose up
```

### Config mysql in container docker

Open mysql container bash script in new terminal

```sh
$ mysql - u root -p -h localhost -P 3306 -D internship;
$ SHOW GLOBAL VARIABLES LIKE '%timestamp%';
$ SET GLOBAL explicit_defaults_for_timestamp = 1;
```

Reference:

[ANT design](https://github.com/iczer/vue-antd-admin.git)

[Vue Authentication](https://github.com/sqreen/vue-authentication-example.git)

[Docker + Nodejs + MySQL](https://blog.vietnamlab.vn/2017/10/24/nhap-mon-docker-dockerizing-a-node-js-web-app-and-mysql/)

[Docker sample](https://www.youtube.com/watch?v=tIbMSqTEpfY)

[Confuse MySQL](https://stackoverflow.com/questions/45399941/node-js-connect-to-mysql-docker-container-econnrefused)

[Youtube](https://www.youtube.com/watch?v=IrMMI9pl9WY)
