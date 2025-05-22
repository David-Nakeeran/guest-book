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

// Add in error handling

app.listen(8080, () => {
  console.log("Server is listening on port 8080...");
});
