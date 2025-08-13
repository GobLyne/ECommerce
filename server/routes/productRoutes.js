const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  const products = await Product.find();
  console.log('Fetched products:', products);
  res.json(products);
});

router.post('/', async (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.json(savedProduct);
});

module.exports = router;