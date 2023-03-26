const express = require("express");
const ProductController = require("../controllers/products.js");

const router = express.Router();

router.get("/getProductList", ProductController.getProductList);


module.exports = router;
