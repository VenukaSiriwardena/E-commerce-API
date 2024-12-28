# E-commerce API

A RESTful API built with Node.js, Express, and MongoDB for managing an e-commerce platform.

## Features

- User Authentication (Signup/Login) with JWT
- Product Management (CRUD operations)
- Order Management (CRUD operations)
- Authentication Middleware
- Input Validation
- Error Handling

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Authentication
- bcrypt for Password Hashing
- Morgan for Logging
- CORS Support
- Nginx for Reverse Proxy
- GitHub Actions for CI/CD
- AWS for Deployment


## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/VenukaSiriwardena/e-commerce-api.git
    cd e-commerce-api
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a .env file in the root directory and add your MongoDB Atlas password and JWT key:
    ```
    MONGO_ATLAS_PASSWORD=your_mongo_atlas_password
    JWT_KEY=your_jwt_key
    ```

4. Start the server:
    ```sh
    npm start
    ```

## API Endpoints

### Authentication
- `POST /user/signup` - Register a new user
- `POST /user/login` - Login user
- `DELETE /user/:userId` - Delete user

### Products
- `GET /products` - Get all products
- `POST /products` - Create a new product
- `GET /products/:productId` - Get a product by ID
- `PATCH /products/:productId` - Update a product by ID
- `DELETE /products/:productId` - Delete a product by ID

### Orders
- `GET /orders` - Get all orders
- `POST /orders` - Create a new order
- `GET /orders/:orderId` - Get an order by ID
- `DELETE /orders/:orderId` - Delete an order by ID

## Middleware

### Authentication Middleware
Located in check.auth.js, this middleware checks for a valid JWT token in the request headers.

## Models

### User Model
Defined in user.js, this model represents a user with an email and password.

### Product Model
Defined in product.js, this model represents a product with a name and price.

### Order Model
Defined in order.js, this model represents an order with a reference to a product and a quantity.

## Routes

### User Routes
Defined in user.js, these routes handle user signup, login, and deletion.

### Product Routes
Defined in products.js, these routes handle CRUD operations for products.

### Order Routes
Defined in orders.js, these routes handle CRUD operations for orders.

## Nginx Configuration

An example Nginx configuration for this API is provided in nginx.conf.

## CI/CD

The project uses GitHub Actions for CI/CD, defined in node.js.yml.

## Deployment

The API is deployed on an AWS EC2 instance and can be accessed at http://54.227.91.88

## License

This project is licensed under the ISC License.

 
