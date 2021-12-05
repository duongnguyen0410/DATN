const knex = require("../knex/knex");
const jwtHelper = require("../jwt/jwt.helper");
const _ = require("lodash");
const shortid = require("shortid");
const ResponseFormat = require("./response.format.js");

let testSQL = () => {
  let query = "select * from users";
  return new Promise((resolve, reject) => {
    // execute query
    db.query(query, (err, result) => {
      if (err) reject();

      if (result && Object.keys(result).length > 0) resolve(result);
      else reject();
    });
  });
};

let AuthLogin = async (req, res) => {
  try {
    let result = await knex("users")
      .select()
      .leftJoin("employee", "users.ID", "employee.ID")
      .where({
        Username: req.body.username,
        Password: req.body.password
      });
    console.log(result);
    if (!result.length) throw new Error();
    let data = {
      admin: false,
      ID: "unknown"
    };

    if (result[0].IDRole.indexOf("A") == 0) {
      data.admin = true;
    } else data.admin = false;

    data.ID = result[0].ID;
    let userData = {
      username: req.body.username,
      ID: data.ID,
      admin: data.admin
    };
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example";
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
    jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife).then(result => {
      res.cookie("Authorization", result);
      data.token = result;
      res.cookie("id", userData.ID);
      jwtHelper.storeToken(userData.ID, result);

      let response = new ResponseFormat(200, true, { item: data }, "");
      res.json(response.stringify());
    });
  } catch (e) {
    console.log("Error with message : ", e);

    let response = new ResponseFormat(400, false, null, e);
    res.json(response.stringify());
  }
};

let Role = (req, res) => {
  let json = req.body;
  json.IDCreated = req.cookies["id"];
  let query = `INSERT INTO \`role\`(\`ID\`, \`Name\`, \`IDCreated\`) VALUES ('${json.ID}','${json.Name}','${json.IDCreated}')`;
  console.log(query);
  queryDB(query)
    .then(result => {
      res.cookie("id", req.cookies ? req.cookies["id"] : "unknown");

      let response = new ResponseFormat(2000, true, { item: json }, "");
      res.json(response.stringify());
    })
    .catch(e => {
      console.log(e);
      res.cookie("id", req.cookies ? req.cookies["id"] : "unknown");

      let response = new ResponseFormat(1000, false, {}, e);
      res.json(response.stringify());
    });
};

let Employee = (req, res) => {
  let json = req.body;
  let now = new Date(Date.now());
  let year = now.getFullYear();
  let month = now.getUTCMonth() + 1;
  let date = now.getDate();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let second = now.getSeconds();
  json.DateCreated = `${year}-${month}-${date} ${hour}:${minutes}:${second}`;
  json.DateUpdated = `${year}-${month}-${date} ${hour}:${minutes}:${second}`;
  json.IDCreated = req.cookies["id"];
  let ID = shortid.generate();
  json.ID = ID;
  let queryUsers = `INSERT INTO \`users\`(\`Username\`, \`ID\`, \`Password\`) VALUES ('${json.Username}','${json.ID}','${json.Password}')`;
  let queryEmployee = `INSERT INTO \`employee\`(\`ID\`, \`Name\`, \`IDCreated\`, \`DateCreated\`, \`DateUpdated\`, \`Sex\`, \`IDRole\`, \`Email\`) 
    VALUES ('${json.ID}','${json.Name}','${json.IDCreated}','${json.DateCreated}','${json.DateUpdated}','${json.Sex}','${json.IDRole}', '${json.Email}')`;

  console.log(queryUsers);
  console.log(queryEmployee);
  queryDB(queryUsers)
    .then(result => queryDB(queryEmployee))
    .then(result => {
      res.cookie("id", req.cookies ? req.cookies["id"] : "unknown");

      let response = new ResponseFormat(2000, true, { item: json }, "");
      res.json(response.stringify());
    })
    .catch(e => {
      console.log(e);
      res.cookie("id", req.cookies ? req.cookies["id"] : "unknown");

      let response = new ResponseFormat(1000, false, {}, e);
      res.json(response.stringify());
    });
};

let Authorization = (req, res, next) => {
  console.log(req.jwtDecoded);
  next();
};
module.exports = {
  testSQL,
  AuthLogin,
  Role,
  Employee,
  Authorization
};
