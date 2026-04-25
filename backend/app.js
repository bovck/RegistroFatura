import mongoose from "mongoose";
import "dotenv/config";
import express from "express";

import faturaRouter from "./routes/fatura.js";
import userRouter from "./routes/user.js";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(faturaRouter);
app.use(userRouter);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

try {
  const result = await mongoose.connect(process.env.DB_URI);
  if (result) {
    app.listen(process.env.PORT);
  }
} catch (err) {
  console.log(err);
}
