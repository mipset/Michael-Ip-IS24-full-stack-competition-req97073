const express = require("express");
const ProductController = require("../controllers/products.js");

const router = express.Router();

router.get("/getProductList", ProductController.getProductList);
router.post("/addProduct", ProductController.addProduct);


module.exports = router;
