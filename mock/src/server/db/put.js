const jwtHelper = require("../jwt/jwt.helper");
const _ = require("lodash");
const gmailAPI = require("../gmail/index");
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
  let query = `UPDATE \`role\` SET \`Name\`='${req.body.Name}'WHERE \`ID\`='${req.body.ID}'`;
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

let Employee = async (req, res) => {
  console.log(req.body);
  let now = new Date(Date.now());
  let year = now.getFullYear();
  let month = now.getUTCMonth() + 1;
  let date = now.getDate();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let second = now.getSeconds();
  req.body.DateUpdated = `${year}-${month}-${date} ${hour}:${minutes}:${second}`;

  let queryUsers = `UPDATE \`users\` SET \`Password\`='${req.body.Password}' WHERE ID='${req.body.ID}'`;
  let queryEmployee = `UPDATE \`employee\` SET 
                        \`Name\`='${req.body.Name}',
                        \`DateUpdated\`='${req.body.DateUpdated}',
                        \`Email\`='${req.body.Email}',
                        \`Sex\`='${req.body.Sex}',
                        \`IDRole\`='${req.body.IDRole}' WHERE ID='${req.body.ID}'`;

  if (req.body.Password) await queryDB(queryUsers);

  try {
    await queryDB(queryEmployee);
    let response = new ResponseFormat(200, true, {}, "");
    res.json(response.stringify());
  } catch (e) {
    console.log(e);
    let response = new ResponseFormat(400, false, {}, e);
    res.json(response.stringify());
  }
};

let Authorization = (req, res, next) => {
  console.log(req.jwtDecoded);
  next();
};
module.exports = {
  testSQL: testSQL,
  Role: Role,
  Employee: Employee,
  Authorization: Authorization
};
