const express = require('express');
const app = express();

const productRoutes = require('./api/routes/product');

app.use('/products', productRoutes);

module.exports = app;