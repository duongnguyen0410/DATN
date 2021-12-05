const router = require("express").Router();

router.use("/api/v2", require("./asset/asset.router.js"));
router.use("/api/v2", require("./product/product.router"));
router.use("/api/v2", require("./bill/bill.router"));
router.use("/api/v2", require("./employee/employee.router"));

module.exports = router;
