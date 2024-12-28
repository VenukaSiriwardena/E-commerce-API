const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const signupRoutes = require('./api/routes/user')

// MongoDB Connection
mongoose.connect(
    `mongodb+srv://venukaransindusiriwardena:${process.env.MONGO_ATLAS_PASSWORD}@cluster0.vfii3.mongodb.net/E-Commerce-API?retryWrites=true&w=majority`
)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

mongoose.Promise = global.Promise;

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', signupRoutes);

// 404 Error Handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// General Error Handling
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
    });
});

module.exports = app;