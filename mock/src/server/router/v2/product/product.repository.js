const knex = require("../../../knex/knex");

const getListProduct = () => {
  return knex("product")
    .select()
    .where({ delete_flag: false });
};

const createProduct = (name, size, price) => {
  return knex("product").insert({ name, size, price });
};

const updateProduct = (id, name, size, price) => {
  return knex("product")
    .update({ name, size, price })
    .where({ id });
};

const deleteProduct = id => {
  return knex("product")
    .update({ delete_flag: true })
    .where({ id });
};

module.exports = {
  getListProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
