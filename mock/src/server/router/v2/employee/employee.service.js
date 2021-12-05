const EmployeeRepository = require("./employee.repository");
const Formatter = require("response-format");
const SIZE = ["S", "M", "L", "XL"];

const getListUser = async (req, res) => {
  try {
    let data = await EmployeeRepository.getListUser();

    res.json(Formatter.success(null, data));
  } catch (error) {
    res.json(Formatter.badRequest("BAD REQUEST", null));
  }
};

const getUserInfo = async (req, res) => {
  try {
    let data = await EmployeeRepository.getUserInfo(req.body.data.ID);
    res.json(Formatter.success(null, data));
  } catch (error) {
    res.json(Formatter.badRequest("BAD REQUEST", null));
  }
};

const updateUserInfo = async (req, res) => {
  try {
    let data = await EmployeeRepository.updateUserInfo(req.body);
    res.json(Formatter.success(null, data));
  } catch (error) {
    res.json(Formatter.badRequest("BAD REQUEST", null));
  }
};

module.exports = {
  getListUser,
  getUserInfo,
  updateUserInfo
};
