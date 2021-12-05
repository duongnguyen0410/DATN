const express = require("express");
const router = express.Router();
const BillService = require("./bill.service");

router
  .route("/bill")
  .get(BillService.getBill)
  .post(BillService.createBill);

module.exports = router;
