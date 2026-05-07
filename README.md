# SoftPrim Backend Technical Exercise

This project is my solution for the Backend Developer technical exercise from SoftPrim Technology SRL.

It implements a small REST API for listing products and placing orders, using Node.js, Express and MariaDB/MySQL. The API follows the requirements from the exercise and returns JSON responses with the appropriate HTTP status codes.

## What this project does

The application exposes three main endpoints:

- `GET /api/products` — returns the list of all products together with their category name
- `GET /api/products/:id` — returns the details of a single product
- `POST /api/orders` — creates a new order for an existing product and updates the available stock

The API supports filtering products by category through the `category_id` query parameter.

For order creation, the total price is always calculated on the server side using the product price stored in the database. The stock update and order insertion are executed in the same transaction so the data remains consistent.

## Tech stack

This project was implemented using:

- Node.js 18+
- Express.js
- MariaDB 10.11 / MySQL 5.7+
- `mysql2`
- `dotenv`

## Project structure

```text
softprim-backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── ordersController.js
│   │   └── productsController.js
│   ├── routes/
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── utils/
│   │   └── validators.js
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
├── package-lock.json
├── README.md
└── setup.sql
