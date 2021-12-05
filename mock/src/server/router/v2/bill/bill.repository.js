const knex = require("../../../knex/knex");

const createBill = (cashier_id, customer_name) => {
  return knex("bill").insert({ cashier_id, customer_name });
};

const createListBillInfo = (bill_id, product_id, quantity) => {
  return knex("bill_info").insert({ bill_id, product_id, quantity });
};

const getListBill = () => {
  return knex("bill_info")
    .column(
      "bill_info.id",
      "bill_info.bill_id",
      "bill_info.product_id",
      {
        product_name: "product.name",
        cashier_name: "employee.Name"
      },
      "product.price",
      "bill_info.quantity",
      "bill.time_check_in",
      "bill.customer_name"
    )
    .select()
    .leftJoin("bill", "bill.id", "bill_info.bill_id")
    .leftJoin("employee", "employee.ID", "bill.cashier_id")
    .leftJoin("product", "product.id", "bill_info.product_id");
};

module.exports = {
  createBill,
  createListBillInfo,
  getListBill
};
