const jwtHelper = require("../jwt/jwt.helper");
const _ = require("lodash");
const ResponseFormat = require("./response.format.js");

let testSQL = () => {
  let query = "select * from department";
  return new Promise((resolve, reject) => {
    // execute query
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
        reject();
      }
      console.log("result", result);
      if (result && Object.keys(result).length > 0) resolve(result);
      else reject();
    });
  });
};

let Role = (req, res) => {
  let query = `select * from role`;

  queryDB(query)
    .then(result => {
      let data = {
        total: result,
        avaiable: _.remove(Object.keys(result[0]), function(e) {
          return e != "ID" && e != "IDCreated";
        }),
        add: _.remove(Object.keys(result[0]), function(e) {
          return e != "IDCreated";
        })
      };

      let response = new ResponseFormat(2000, true, data, "");
      res.json(response.stringify());
    })
    .catch(e => {
      if (e.type == "error") {
        console.log("Query company with error!");

        let response = new ResponseFormat(1000, false, {}, "Failed get data");
        res.json(response.stringify());
      } else {
        // query with data empty => table empty
        let data = {
          total: [],
          avaiable: ["Name"],
          add: ["Name", "ID"]
        };

        let response = new ResponseFormat(2000, true, data, "");
        res.json(response.stringify());
      }
    });
};

let Employee = (req, res) => {
  let query = `select users.ID, Name, IDCreated, DateCreated, DateUpdated, Sex, employee.IDRole, Email, users.Username
    from employee, users 
    where users.ID = employee.ID`;

  queryDB(query)
    .then(result => {
      let data = {
        total: result,
        avaiable: _.pull(Object.keys(result[0]), "ID", "IDCreated", "DateCreated", "DateUpdated", "Password"),
        add: [..._.pull(Object.keys(result[0]), "ID", "IDCreated", "DateCreated", "DateUpdated"), "Password"]
      };

      let response = new ResponseFormat(2000, true, data, "");
      res.json(response.stringify());
    })
    .catch(e => {
      console.log("error");
      if (e.type == "error") {
        console.log("Query company with error!");

        let response = new ResponseFormat(1000, false, {}, "Failed get data");
        res.json(response.stringify());
      } else {
        // query with data empty => table empty
        let data = {
          total: [],
          avaiable: ["Name", "Sex", "IDRole", "Username"],
          add: ["Name", "Sex", "IDRole", "Username", "Password"]
        };

        let response = new ResponseFormat(2000, true, data, "");
        res.json(response.stringify());
      }
    });
};

let Logout = (req, res) => {
  let tokenFromClient = req.headers["Authorization"] || (req.cookies ? req.cookies["Authorization"] : "unknown");
  let id = req.cookies["id"];
  jwtHelper.removeToken(id);
  res.clearCookie("Authorization");
  res.clearCookie("id");
  let response = new ResponseFormat(2000, true, {}, "");
  res.json(response.stringify());
};

let UserRole = (req, res) => {
  let response = new ResponseFormat(2000, true, { admin: req.jwtDecoded.data.admin }, "");
  res.json(response.stringify());
};

let Verify = (req, res) => {
  let query = `UPDATE \`assetmanager\` SET 
                \`IDManaged\`='${req.query.ID}',
                \`Status\`='Confirmed' WHERE STT=${req.query.STT}`;

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
let Authorization = (req, res, next) => {
  // console.log(req.jwtDecoded);
  next();
};
module.exports = {
  testSQL: testSQL,
  Logout: Logout,
  Role: Role,
  Employee: Employee,
  UserRole: UserRole,
  Verify: Verify,
  Authorization: Authorization
};
