const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order'); 
const checkAuth = require('../middleware/check.auth');

router.get('/', checkAuth, (req, res, next) => {
    Order.find()
    .populate('product') // get the product associated with the order
    .exec()
    .then(orders => {
        res.status(200).json({
            count: orders.length,
            orders: orders.map(order => {
                return {
                    _id: order._id,
                    product: order.product,
                    quantity: order.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + order._id
                    }
                }
            })
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', checkAuth, async (req, res) => {
    try {
        // Validate input
        if (!mongoose.Types.ObjectId.isValid(req.body.product)) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (!Number.isInteger(req.body.quantity) || req.body.quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive integer' });
        }

        // Create and save order
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: req.body.product,
            quantity: req.body.quantity,
        });
        const result = await order.save();

        // Respond to client
        res.status(201).json({
            message: 'Order was created',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
            },
            request: {
                type: 'GET',
                url: `http://localhost:3000/orders/${result._id}`,
            },
        });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:orderId', checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product') // get the product associated with the order
    .exec()
    .then(order => {
        if (order) {
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.patch('/:orderId', checkAuth, (req, res, next) => {
    res.status(200).json({
        message: 'Updated order'
    });
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
    const orderId = req.params.orderId;

    // Ensure the ID is valid
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    Order.findByIdAndDelete(orderId) // Deletes the order by ID
        .then(deletedOrder => {
            if (!deletedOrder) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                message: 'Order deleted successfully',
                deletedOrder: deletedOrder,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { product: 'ID', quantity: 'Number' }
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
});

module.exports = router;