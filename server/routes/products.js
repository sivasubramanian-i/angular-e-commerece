const express = require("express");
const router = express.Router();

const ProductsController = require("../controllers/products");

router.get("/", ProductsController.getProducts);
router.post("/productdetails", ProductsController.getProductDetails);

module.exports = router;
