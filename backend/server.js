import express from "express";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
