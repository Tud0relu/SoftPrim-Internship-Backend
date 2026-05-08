require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL successfully");
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server is running on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
