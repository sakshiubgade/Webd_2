const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

const initializeServerAndDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(4000, () => {
      console.log("Server started on port 4000");
    });

    process.on("SIGINT", async () => {
      await db.close();
      process.exit();
    });
  } catch (e) {
    console.error("Error initializing server and database:", e);
    process.exit(1);
  }
};

// Wrap the server initialization in an IIFE to immediately invoke it
(async () => {
  await initializeServerAndDb();
})();

// Use a router for better organization
const router = express.Router();

router.get("/books", async (req, res) => {
  try {
    const getBooksQuery = `SELECT * FROM book ORDER BY book_id;`;
    const booksArray = await db.all(getBooksQuery);
    res.json(booksArray); // Send response as JSON
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/authors", async (req, res) => {
  try {
    const getAuthorQuery = `SELECT * FROM author ORDER BY author_id;`;
    const authorArray = await db.all(getAuthorQuery);
    res.json(authorArray); // Send response as JSON
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Mount the router at the base path
app.use("/", router);

module.exports = app; // Export the app for testing purposes
