const router = require("express").Router();
const sql = require("../db/post");

router.post("/test", (req, res) => {
  res.json({ success: true, type: "POST" });
});
router.post("/login", sql.Authorization, sql.AuthLogin);
router.post("/employees", sql.Authorization, sql.Employee);

module.exports = router;
