const BillRepository = require("./bill.repository");
const Formatter = require("response-format");
const SIZE = ["S", "M", "L", "XL"];

const createBill = async (req, res) => {
  const { cashier_id, customer_name, data } = req.body;

  try {
    let bill = await BillRepository.createBill(cashier_id, customer_name);
    await Promise.all(data.map(item => BillRepository.createListBillInfo(bill[0], item.id, item.quantity)));
    res.json(Formatter.success(null, null));
  } catch (error) {
    res.json(Formatter.badRequest("BAD REQUEST", null));
  }
};

const getBill = async (req, res) => {
  try {
    let listBill = await BillRepository.getListBill();
    res.json(Formatter.success(null, listBill));
  } catch (error) {
    res.json(Formatter.badRequest("BAD REQUEST", null));
  }
};

module.exports = {
  createBill,
  getBill
};
