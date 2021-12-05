const express = require("express");
const router = express.Router();
const EmployeeService = require("./employee.service");

router.route("/staff").get(EmployeeService.getListUser);

router
  .route("/staff/info")
  .post(EmployeeService.getUserInfo)
  .put(EmployeeService.updateUserInfo);

module.exports = router;
