# SoftPrim Fullstack Technical Exercise

This project is my solution for the Fullstack Developer technical exercise from SoftPrim Technology SRL.

The application contains:
- a **backend API** built with Node.js, Express and MariaDB/MySQL
- a **frontend web interface** built with HTML, CSS and vanilla JavaScript

The frontend communicates with the backend over HTTP and allows the user to browse products and filter them by category.

---

## Technologies used

### Backend
- **Language:** Node.js 18+
- **Framework:** Express.js
- **Database:** MariaDB 10.11 (compatible with MySQL 5.7+)
- **Database library:** mysql2
- **Environment configuration:** dotenv
- **CORS:** cors

### Frontend
- **HTML5**
- **CSS3**
- **Vanilla JavaScript**

---

## Project structure

```text
fullstack/
├── setup.sql
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── categoriesController.js
│   │   │   └── productsController.js
│   │   ├── routes/
│   │   │   ├── categoryRoutes.js
│   │   │   └── productRoutes.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── screenshots/
    ├── desktop.png
    └── mobile.png
```

---

## Installation

### 1. Clone the repository

```bash
git clone <repo-link>
cd fullstack
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Frontend dependencies

The frontend is implemented using static files (HTML + CSS + JavaScript), so there are no npm dependencies to install for the frontend.

---

## Database setup

The project uses the provided `setup.sql` file.

### 1. Create the database

Open MariaDB/MySQL:

```bash
sudo mariadb
```

Then run:

```sql
CREATE DATABASE IF NOT EXISTS softprim_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'softprim_user'@'localhost' IDENTIFIED BY 'softprim_pass';
GRANT ALL PRIVILEGES ON softprim_test.* TO 'softprim_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Import the SQL file

From the root project folder:

```bash
sudo mariadb softprim_test < setup.sql
```

### 3. Verify the tables

```bash
sudo mariadb -e "USE softprim_test; SHOW TABLES;"
```

Expected tables:

```
categories
products
orders
```

For this exercise, the application uses only:

```
categories
products
```

---

## Configuration

### Backend configuration

Create a `.env` file inside the `backend` folder, based on `.env.example`.

Example:

```env
PORT=3002
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=softprim_user
DB_PASSWORD=softprim_pass
DB_NAME=softprim_test
FRONTEND_ORIGIN=http://127.0.0.1:5500
```

### Frontend configuration

The API base URL is configured in:

```
frontend/app.js
```

Example:

```js
const API_BASE_URL = "http://127.0.0.1:3002/api";
```

If the backend port changes, this value should be updated accordingly.

---

## Running the application

### Start the backend

From the `backend` folder:

```bash
cd backend
npm run dev
```

Default backend URL:

```
http://127.0.0.1:3002
```

### Access the frontend

From the `frontend` folder, start a local static server:

```bash
cd frontend
python3 -m http.server 5500 --bind 127.0.0.1
```

Then open in browser:

```
http://127.0.0.1:5500
```

> **Notes**
> - The backend must be running before opening the frontend.
> - The frontend origin must match the value configured in `FRONTEND_ORIGIN` in the backend `.env` file.

---

## Implemented features

### Backend
- `GET /api/categories`
- `GET /api/products`
  - optional filtering with `category_id`
  - validation for invalid `category_id`
- JSON responses with appropriate HTTP status codes
- CORS enabled for local frontend development

### Frontend
- loads all categories dynamically from the backend
- shows all products on page load
- filters products by selected category
- displays:
  - product name
  - category name
  - price formatted with 2 decimals and RON
  - current stock
- visually highlights products with stock `0`
- includes loading, empty state and error state messages

---

## API endpoints

### 1. `GET /api/categories`

Returns the list of categories sorted alphabetically.

**Example request:**

```bash
curl -i http://127.0.0.1:3002/api/categories
```

**Example response:**

```json
[
  {
    "id": 5,
    "name": "Conectori și accesorii",
    "slug": "conectori-accesorii"
  },
  {
    "id": 2,
    "name": "Contoare electrice",
    "slug": "contoare-electrice"
  }
]
```

---

### 2. `GET /api/products`

Returns all products together with their category name.

**Example request:**

```bash
curl -i http://127.0.0.1:3002/api/products
```

**Example response:**

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

**Optional filter:** `GET /api/products?category_id=1`

```bash
curl -i "http://127.0.0.1:3002/api/products?category_id=1"
```

**Example invalid request:**

```bash
curl -i "http://127.0.0.1:3002/api/products?category_id=abc"
```

**Example error response:**

```json
{
  "error": "category_id must be a positive integer"
}
```

---

## Screenshots

### Desktop

The screenshots are located in frontend/ folder.

---

## Technical decisions

### Why Express for the backend

I chose Express because it is lightweight, easy to configure and suitable for a small REST API like this one.

### Why JavaScript for the frontend

I chose JavaScript because the frontend requirements are relatively simple, and this approach keeps the application lightweight and easy to run without additional build steps.

### Why separate backend and frontend folders

The backend and frontend are separated in order to keep responsibilities clear:

- `backend` handles data access and API responses
- `frontend` handles rendering and user interaction

This also makes it easier to run and test both parts independently during development.

### Why CORS is configured explicitly

CORS is configured so that the frontend running locally on a specific origin can call the backend API during development.
