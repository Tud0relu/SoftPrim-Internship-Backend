const pool = require("../config/db");
const { isPositiveInteger, isValidEmail } = require("../utils/validators");

async function createOrder(req, res) {
  const { product_id, quantity, customer_email } = req.body;

  if (!isPositiveInteger(product_id)) {
    return res.status(400).json({
      error: "product_id must be a positive integer"
    });
  }

  if (!isPositiveInteger(quantity)) {
    return res.status(400).json({
      error: "quantity must be a positive integer greater than 0"
    });
  }

  if (!isValidEmail(customer_email)) {
    return res.status(400).json({
      error: "customer_email must be a valid email with maximum 150 characters"
    });
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [products] = await connection.execute(
      `
      SELECT id, price, stock
      FROM products
      WHERE id = ?
      FOR UPDATE
      `,
      [Number(product_id)]
    );

    if (products.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        error: "Product not found"
      });
    }

    const product = products[0];

    if (Number(quantity) > Number(product.stock)) {
      await connection.rollback();
      return res.status(400).json({
        error: "Insufficient stock"
      });
    }

    const total = Number((Number(product.price) * Number(quantity)).toFixed(2));

    const [orderResult] = await connection.execute(
      `
      INSERT INTO orders (product_id, quantity, customer_email, total)
      VALUES (?, ?, ?, ?)
      `,
      [Number(product_id), Number(quantity), customer_email, total]
    );

    await connection.execute(
      `
      UPDATE products
      SET stock = stock - ?
      WHERE id = ?
      `,
      [Number(quantity), Number(product_id)]
    );

    const [newOrders] = await connection.execute(
      `
      SELECT id, product_id, quantity, total, created_at
      FROM orders
      WHERE id = ?
      LIMIT 1
      `,
      [orderResult.insertId]
    );

    await connection.commit();

    return res.status(201).json({
      order_id: newOrders[0].id,
      product_id: newOrders[0].product_id,
      quantity: newOrders[0].quantity,
      total: Number(newOrders[0].total),
      created_at: newOrders[0].created_at
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("rollback error:", rollbackError);
      }
    }

    console.error("createOrder error:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  createOrder
};
