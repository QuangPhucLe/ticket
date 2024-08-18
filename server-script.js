// server-script.js

const mysql = require("mysql2/promise");
const express = require("express");
const app = express();
const port = 3000;

const connectionConfig = {
  host: "localhost",
  user: "quangphuc",
  password: "QuangPhuc0609003",
  database: "ticket_db",
};

async function connectToMySQL() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Connected to MySQL");
    return connection;
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
  }
}

app.use(express.static("public")); // Serve static files from the "public" directory

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function saveHistory(date, total) {
  const connection = await connectToMySQL();
  if (connection) {
    try {
      const [result] = await connection.execute(
        "INSERT INTO boc_so_history (date, total) VALUES (?, ?)",
        [date, total]
      );
      console.log("History saved to MySQL:", result);
    } catch (error) {
      console.error("Error saving history:", error);
    } finally {
      await connection.end();
    }
  }
}
