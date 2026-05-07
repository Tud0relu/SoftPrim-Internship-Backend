# SoftPrim Backend Technical Exercise

This project is my solution for the Backend Developer technical exercise from SoftPrim Technology SRL.

It implements a small REST API for listing products and placing orders, using Node.js, Express and MariaDB/MySQL. The API returns JSON responses and uses the appropriate HTTP status codes depending on the result of each request.

## Technologies used

- **Backend language:** Node.js 18+
- **Framework:** Express.js
- **Database:** MariaDB 10.11 (compatible with MySQL 5.7+)
- **Database library:** mysql2
- **Environment configuration:** dotenv

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
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── setup.sql
```

## Installation

First, open a terminal and go to the project folder:

```bash
cd softprim-backend
```

Install the dependencies:

```bash
npm install
```

## Database setup

The project uses the `setup.sql` file provided with the exercise.

### 1. Create the database

Open MariaDB/MySQL:

```bash
sudo mariadb
```

Then run the following SQL commands:

```sql
CREATE DATABASE IF NOT EXISTS softprim_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'softprim_user'@'localhost' IDENTIFIED BY 'softprim_pass';
GRANT ALL PRIVILEGES ON softprim_test.* TO 'softprim_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Import the SQL file

From the project folder, run:

```bash
sudo mariadb softprim_test < setup.sql
```

### 3. Verify the tables

You can verify that the database was initialized correctly with:

```bash
sudo mariadb -e "USE softprim_test; SHOW TABLES;"
```

The expected tables are:

- `categories`
- `products`
- `orders`

## Configuration

Create a `.env` file in the root of the project, based on `.env.example`.

Example `.env` file:

```env
PORT=3002

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=softprim_user
DB_PASSWORD=softprim_pass
DB_NAME=softprim_test
```

Example `.env.example`:

```env
PORT=3002

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=softprim_test
```

The application reads the database connection details from environment variables using dotenv.

## Running the server

For development mode:

```bash
npm run dev
```

For normal start:

```bash
npm start
```

By default, the server runs on:

```
http://127.0.0.1:3002
```

## API endpoints

### 1. GET /api/products

Returns all products together with the name of their category.

Example request:

```bash
curl -i http://127.0.0.1:3002/api/products
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Siguranță automată 1P+N 16A curba C",
    "price": "45.50",
    "stock": 120,
    "category_id": 1,
    "category_name": "Întrerupătoare automate"
  },
  {
    "id": 2,
    "name": "Siguranță automată 1P+N 25A curba C",
    "price": "52.00",
    "stock": 85,
    "category_id": 1,
    "category_name": "Întrerupătoare automate"
  }
]
```

Optional filter: `GET /api/products?category_id=1`

Returns only the products from the given category.

Example request:

```bash
curl -i "http://127.0.0.1:3002/api/products?category_id=1"
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Siguranță automată 1P+N 16A curba C",
    "price": "45.50",
    "stock": 120,
    "category_id": 1,
    "category_name": "Întrerupătoare automate"
  }
]
```

### 2. GET /api/products/:id

Returns the details of a single product.

Example request:

```bash
curl -i http://127.0.0.1:3002/api/products/1
```

Example response:

```json
{
  "id": 1,
  "name": "Siguranță automată 1P+N 16A curba C",
  "price": "45.50",
  "stock": 120,
  "category_id": 1,
  "category_name": "Întrerupătoare automate",
  "created_at": "2026-05-07T15:39:00.000Z"
}
```

### 3. POST /api/orders

Creates a new order for an existing product and decreases the stock.

Example request:

```bash
curl -i -X POST http://127.0.0.1:3002/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 5,
    "quantity": 2,
    "customer_email": "client@exemplu.ro"
  }'
```

Example response:

```json
{
  "order_id": 1,
  "product_id": 5,
  "quantity": 2,
  "total": 640,
  "created_at": "2026-05-07T15:46:16.000Z"
}
```

## Validation and error handling

The API validates the incoming data and returns JSON error messages when the request is invalid.

### Invalid category_id

```bash
curl -i "http://127.0.0.1:3002/api/products?category_id=abc"
```

Response:

```json
{
  "error": "category_id must be a positive integer"
}
```

### Product not found

```bash
curl -i http://127.0.0.1:3002/api/products/9999
```

Response:

```json
{
  "error": "Product not found"
}
```

### Invalid email

```bash
curl -i -X POST http://127.0.0.1:3002/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 5,
    "quantity": 2,
    "customer_email": "email-invalid"
  }'
```

Response:

```json
{
  "error": "customer_email must be a valid email with maximum 150 characters"
}
```

### Insufficient stock

```bash
curl -i -X POST http://127.0.0.1:3002/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 5,
    "quantity": 99999,
    "customer_email": "client@exemplu.ro"
  }'
```

Response:

```json
{
  "error": "Insufficient stock"
}
```

## Technical decisions

### Why Express

I chose Express because it is lightweight, easy to configure, and well suited for a small REST API like this one.

### Why mysql2/promise

I used mysql2/promise so the code can use async/await, which keeps the database logic easier to read and maintain.

### Why a SQL transaction for order creation

Creating an order and updating the product stock must happen together as a single unit of work. Because of this, I used a SQL transaction. If one operation fails, the other one is rolled back.

### Why SELECT ... FOR UPDATE

When creating an order, I lock the selected product row with `FOR UPDATE` in order to reduce the risk of stock inconsistencies if multiple requests try to place orders for the same product at the same time.