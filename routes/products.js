const express = require('express');
const router = express.Router();
const { getAllProducts, addOneProduct, getAllProductsStatic } = require('../controllers/products.js');

router.route('/').get(getAllProducts).post(addOneProduct);

router.route('/static').get(getAllProductsStatic);

module.exports = router;