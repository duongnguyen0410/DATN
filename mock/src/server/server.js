const path = require("path");
if (!process.env.ENV_POINT) require("dotenv-flow").config();

const express = require("express");
const webpack = require("webpack");
const config = require("../webpack.config.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authUser = require("./middleware/AuthMiddleWare");

const GetRouter = require("./router/get");
const PostRouter = require("./router/post");
const PutRouter = require("./router/put");
const DeleteRouter = require("./router/delete");
const mysql = require("mysql");
const WebpackDevMiddleWare = require("webpack-dev-middleware");
const compiler = webpack(config);
const _ = require("lodash");

const app = express();
/**
 * -------------------------------- Middle ware--------------------------------
 */

app.use(cookieParser());
app.use((req, res, next) => {
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let method = req.method;
  let url = req.url;
  let status = res.statusCode;
  let log = `[${formatted_date}] ${method}:${url} ${status}`;
  console.log(log);
  next();
})

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//middle ware for static folder
app.use(function(req, res, next) {
  var index = req.url.indexOf("/static");
  if (index >= 0) {
    var sub = req.url.substring(index);
    res.sendFile(path.join(__dirname, "../../", sub));
  } else next();
});
/**
 * config for mysql
 */
const mySQLOption = {
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "internship",
  dateStrings: "DATETIME"
};
const db = mysql.createConnection(mySQLOption);
// environment variables
const PORT = process.env.PORT || 4000;

/**
 * connect to mysql
 */
setTimeout(() => {
  db.connect(err => {
    if (err) {
      return console.log(err);
    } else {
      console.log("Connected to MySQL server:", mySQLOption);

      app.listen(PORT, err => {
        if (err) {
          console.error("Error starting  server", err);
        } else {
          console.log(`Server listenning at PORT: ${PORT}`);
          console.log(`Waitting for webpack build response`);
        }
      });
    }
  });
}, 5000);
global.db = db;

global.queryDB = query => {
  return new Promise((resolve, reject) => {
    // execute query
    db.query(query, (err, result) => {
      if (err) reject({ type: "error", result });

      if (result && Object.keys(result).length > 0) {
        resolve(result);
      } else reject({ type: "empty", result });
    });
  });
};

//middle ware for webpack
app.use(
  WebpackDevMiddleWare(compiler, {
    publicPath: "/__build__/",
    stats: {
      colors: true,
      chunks: false
    }
  })
);

//---------------------------RESTful-----------------------------
//authentication user before have action with app
app.use(authUser.isAuth);

app.use("/", GetRouter);
app.use("/", PostRouter);
app.use("/", PutRouter);
app.use("/", DeleteRouter);
app.use(require("./router/v2/index.js"));

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});
