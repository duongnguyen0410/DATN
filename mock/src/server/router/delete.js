const router = require("express").Router();
const sql = require("../db/delete");

router.delete("/test", (req, res) => {
  res.json({ success: true, type: "Delete" });
});
router.delete("/employees", sql.Authorization, sql.Employee);

module.exports = router;
