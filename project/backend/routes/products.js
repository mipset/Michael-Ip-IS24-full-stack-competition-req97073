const express = require("express");
const ProductController = require("../controllers/products.js");

const router = express.Router();

router.get("/", ProductController.getProductList);
router.post("/:productId", ProductController.addProduct);
router.put("/:productId", ProductController.editProduct);
router.delete("/:productId", ProductController.deleteProduct);


module.exports = router;
