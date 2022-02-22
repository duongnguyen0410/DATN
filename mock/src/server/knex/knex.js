const knex = require("knex")({
	client: "mysql",
	connection: {
		host: process.env.MYSQL_HOST || "127.0.0.1",
		port: process.env.MYSQL_PORT || 3306,
		user: process.env.MYSQL_USER || "root",
		password: process.env.MYSQL_PASSWORD || "",
		database: process.env.MYSQL_DATABASE || "internship"
	}
});

module.exports = knex;
