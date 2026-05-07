const pool = require("../config/db");
const { isPositiveInteger, isValidCategoryId } = require("../utils/validators");

async function getProducts(req, res) {
  try {
    const { category_id } = req.query;

    if (!isValidCategoryId(category_id)) {
      return res.status(400).json({
        error: "category_id must be a positive integer"
      });
    }

    let sql = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.stock,
        p.category_id,
        c.name AS category_name
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
    `;
    const params = [];

    if (category_id !== undefined) {
      sql += ` WHERE p.category_id = ?`;
      params.push(Number(category_id));
    }

    sql += ` ORDER BY p.id ASC`;

    const [rows] = await pool.execute(sql, params);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("getProducts error:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;

    if (!isPositiveInteger(id)) {
      return res.status(400).json({
        error: "Product id must be a positive integer"
      });
    }

    const sql = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.stock,
        p.category_id,
        c.name AS category_name,
        p.created_at
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
      LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [Number(id)]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("getProductById error:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
}

module.exports = {
  getProducts,
  getProductById
};
