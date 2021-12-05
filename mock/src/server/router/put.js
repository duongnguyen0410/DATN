const router = require("express").Router();
const sql = require("../db/put");

router.put("/test", (req, res) => {
  res.json({ success: true, type: "PUT" });
});
router.put("/employees", sql.Authorization, sql.Employee);

module.exports = router;
