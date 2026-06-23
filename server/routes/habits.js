import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import Habit from "../models/Habit.js";
const router = Router();

// @route   POST /api/auth/login
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the authenticated request
    const habits = await Habit.find({ userId });
    res.json({ habits });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});
router.post("/", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  if (!title?.trim())
    return res.status(400).json({ message: "Title is required" });
  try {
    const userId = req.user.id; // Get user ID from the authenticated request
    const newHabit = await Habit.create({
      title,
      description,
      userId,
    });
    res.status(201).json({ habit: newHabit });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", authMiddleware, async (req, res) => {
  const habitId = req.params.id;
  try {
    const userId = req.user.id; // Get user ID from the authenticated request
    const habit = await Habit.findOneAndDelete({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});
router.patch("/:id/toggle", authMiddleware, async (req, res) => {
  const habitId = req.params.id;
  try {
    const userId = req.user.id; // Get user ID from the authenticated request
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    const today = new Date().toISOString().split("T")[0]; // "2026-05-30"
    const alreadyDone = habit.completions.includes(today);
    if (alreadyDone) {
      habit.completions = habit.completions.filter((d) => d !== today); // remove
    } else {
      habit.completions.push(today); // add
    }
    habit.streak = habit.calculateStreak();
    await habit.save();
    res.json({ habit });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});
export default router;
