import express from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB connection
const db = new Pool({
  connectionString: process.env.DB_CONNECTION,
});

// test route
app.get("/", (req, res, next) => {
  res.json({ message: "test" });
});

// POST route
app.post("/", async (req, res, next) => {
  try {
    const { first_name, surname, message } = req.body;

    await db.query(
      `INSERT INTO messages (first_name, surname, message) VALUES($1, $2, $3)`,
      [first_name, surname, message]
    );

    res.status(201).json({
      success: true,
      message: "Message created successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Add in error handling
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      statusCode,
      message,
    },
  });
};

app.use(errorHandler);

app.listen(8080, () => {
  console.log("Server is listening on port 8080...");
});
