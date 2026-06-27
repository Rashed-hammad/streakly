import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import habitsRoutes from "./routes/habits.js";
import authMiddleware from "./middleware/auth.js";
dotenv.config();
const app = express();
app.use(
  cors({
    origin: "https://streakly-livid.vercel.app",
    credentials: true,
  }),
);
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api/auth", authRoutes);
app.use("/api/habits", authMiddleware, habitsRoutes);
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
