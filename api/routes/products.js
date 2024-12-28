const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check.auth');

const Product = require('../models/product');

router.get('/', checkAuth, (req, res, next) => {
    Product.find()
    .select('name price _id') //control which data is returned
    .exec()
    .then((products) => {
        const response = {
            count: products.length,
            products: products.map((product) => {
                return {
                    name: product.name,
                    price: product.price,
                    _id: product._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + product._id
                    }
                };
            })
        };
        if (products.length > 0) {
            res.status(200).json(response);
        } else {
            res.status(404).json({
                message: 'No entries found'
            });
        }
    })
    .catch((err) => {
        console.error('Database error:', err);
        res.status(500).json({
            message: 'An error occurred while retrieving products',
            error: err.message,
        });
    });
});

router.post('/', checkAuth, (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requests to /products',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: 'No valid entry found for provided ID'
        });
    }

    // Query the database
    Product.findById(id)
        .exec()
        .then((product) => {
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID',
                });
            }
        })
        .catch((err) => {
            console.error('Database error:', err);
            res.status(500).json({
                message: 'An error occurred while retrieving the product',
                error: err.message,
            });
        });
});

router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps})//{ $set: { name: req.body.newName, price: req.body.newPrice} })
    .exec()
    .then((result) => {
        res.status(200).json(result);
        console.log(result);
    })
    .catch((err) => {
        console.error('Database error:', err);
        res.status(500).json({
            message: 'An error occurred while updating the product',
            error: err.message,
        });
    })
});
//Thats the format of the update
//[
//    { propName: 'name', value: "Harry Potter 2" },
//    { propName: 'price', value: "10" }
//]

router.delete('/:productId', checkAuth, (req, res, next) => {
    Product.remove({ _id: req.params.productId })
        .exec()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.error('Database error:', err);
            res.status(500).json({
                message: 'An error occurred while deleting the product',
                error: err.message,
            });
        });             
});

module.exports = router;