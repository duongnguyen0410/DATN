const router = require("express").Router();
const sql = require("../db/get");

router.get("/test", (req, res) => {
  res.json({ success: true, type: "GET" });
});
router.get("/userRole", sql.Authorization, sql.UserRole);
router.get("/logout", sql.Authorization, sql.Logout);
router.get("/roles", sql.Authorization, sql.Role);
router.get("/employees", sql.Authorization, sql.Employee);

module.exports = router;
