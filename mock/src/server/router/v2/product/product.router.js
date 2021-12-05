const express = require("express");
const router = express.Router();
const ProductService = require("./product.service");

router
  .route("/products")
  .get(ProductService.getListProduct)
  .post(ProductService.createProduct)
  .put(ProductService.updateProduct)
  .delete(ProductService.deleteProduct);

router.get("/products/size", ProductService.getListSize);

module.exports = router;
