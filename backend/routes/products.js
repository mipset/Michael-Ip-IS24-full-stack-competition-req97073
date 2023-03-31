const express = require("express");
const ProductController = require("../controllers/products.js");

const router = express.Router();

//simple express router setup to navigate each api call

router.get("/", ProductController.getProductList);
router.get("/:productId", ProductController.getOneProduct);
router.post("/:productId", ProductController.addProduct);
router.put("/:productId", ProductController.editProduct);
router.delete("/:productId", ProductController.deleteProduct);


module.exports = router;
