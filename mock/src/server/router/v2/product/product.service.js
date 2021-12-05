const ProductRepository = require("./product.repository");
const Formatter = require("response-format");
const SIZE = ["S", "M", "L", "XL"];

const getListProduct = async (req, res) => {
  let listAsset = await ProductRepository.getListProduct();
  res.json(Formatter.success(null, listAsset));
};

const getListSize = async (req, res) => {
  res.json(Formatter.success(null, SIZE));
};

const createProduct = async (req, res) => {
  let { name, size, price } = req.body;
  try {
    let listAsset = await ProductRepository.createProduct(name, size, price);
    res.json(Formatter.success(null, listAsset));
  } catch (error) {
    res.json(Formatter.badRequest("BAD REQUEST", null));
  }
};

const updateProduct = async (req, res) => {
  let { id, name, size, price } = req.body;
  try {
    let listAsset = await ProductRepository.updateProduct(id, name, size, price);
    res.json(Formatter.success(null, listAsset));
  } catch (error) {
    res.json(Formatter.badRequest("BAD REQUEST", null));
  }
};

const deleteProduct = async (req, res) => {
  try {
    let data = await ProductRepository.deleteProduct(req.body.id);
    res.json(Formatter.success(null, data));
  } catch (error) {
    res.json(Formatter.badRequest("BAD REQUEST", null));
  }
};

module.exports = {
  getListProduct,
  createProduct,
  updateProduct,
  deleteProduct,

  getListSize
};
