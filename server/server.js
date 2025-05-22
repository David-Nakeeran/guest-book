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

// GET all messages
app.get("/", async (req, res, next) => {
  try {
    const result = await db.query(`SELECT * FROM messages`);

    res.status(200).json({
      success: true,
      messages: result.rows,
    });
  } catch (error) {
    next(error);
  }
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

const getMessageById = async (messageId) => {
  try {
    const result = await db.query(`SELECT * FROM messages WHERE id = $1`, [
      messageId,
    ]);

    if (result.rows.length === 0) {
      const error = new Error("Message not found");
      error.statusCode = 404;
      throw error;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// DELETE message by :id
app.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await getMessageById(id);

    const messageId = result.rows[0].message.id;

    await db.query(`DELETE FROM messages WHERE id = $1`, [messageId]);

    res.status(200).json({
      success: true,
      message: messageId,
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
