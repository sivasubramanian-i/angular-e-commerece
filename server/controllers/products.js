const Products = require("../models/products");

exports.getProducts = (req, res, next) => {
  try {
    Products.find().then(prods => {
      res.status(200).json({
        status: true,
        products: prods
      });
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      msg: err
    });
  }
};

exports.getProductDetails = (req, res, next) => {
  console.log(req.body.productid);
  try {
    Products.findOne({ _id: req.body.productid }).then(prods => {
      res.status(200).json({
        productinfo: prods
      });
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      msg: err
    });
  }
};
