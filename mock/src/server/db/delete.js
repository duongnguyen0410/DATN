const _ = require("lodash");
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

let Role = (req, res) => {
  let query = `DELETE FROM \`role\` WHERE ID='${req.query.ID}'`;
  console.log(query);
  queryDB(query)
    .then(result => {
      let response = new ResponseFormat(2000, true, {}, "");
      res.json(response.stringify());
    })
    .catch(e => {
      console.log(e);
      let response = new ResponseFormat(1000, false, {}, e);
      res.json(response.stringify());
    });
};

let Employee = (req, res) => {
  let queryUsers = `DELETE FROM \`users\` WHERE ID='${req.query.ID}'`;
  let queryEmployee = `DELETE FROM \`employee\` WHERE ID='${req.query.ID}'`;

  let queryFallBack = `select * from employee where ID='${req.query.ID}'`;

  let json;
  queryDB(queryFallBack)
    .then(result => {
      json = JSON.parse(JSON.stringify(result[0]));
      return queryDB(queryEmployee);
    })
    .then(result => queryDB(queryUsers))
    .then(result => {
      let response = new ResponseFormat(2000, true, {}, "");
      res.json(response.stringify());
    })
    .catch(e => {
      let queryEmployeeFallBack = `INSERT INTO \`employee\`(\`ID\`, \`Name\`, \`IDCreated\`, \`DateCreated\`, \`DateUpdated\`, \`Sex\`, \`IDRole\`, \`Email\`) 
        VALUES ('${json.ID}','${json.Name}','${json.IDCreated}','${json.DateCreated}','${json.DateUpdated}','${json.Sex}','${json.IDRole}', '${json.Email}')`;
      queryDB(queryEmployeeFallBack);
      console.log(e);
      let response = new ResponseFormat(1000, false, {}, e);
      res.json(response.stringify());
    });
};

let Authorization = (req, res, next) => {
  /**{
  data: { username: 'giapdong', ID: 'PPBqWA9', admin: true },
  iat: 1592205824,
  exp: 1592209424
} */
  if (req.url.match(/verify/g)) console.log(req.jwtDecoded);
  next();
};
module.exports = {
  testSQL: testSQL,
  Role: Role,
  Employee: Employee,
  Authorization: Authorization
};
