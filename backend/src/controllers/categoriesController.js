const pool = require("../config/db");

async function getCategories(req, res) {
  try {
    const sql = `
      SELECT id, name, slug
      FROM categories
      ORDER BY name ASC
    `;

    const [rows] = await pool.execute(sql);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("getCategories error:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
}

module.exports = {
  getCategories
};
