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
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  if (!title?.trim())
    return res.status(400).json({ message: "Title is required" });
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title: title.trim(), description: description?.trim() || "" },
      { new: true },
    );
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    res.json({ habit });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
      habit.completions.push(today);

      const { note } = req.body;

      if (note && note.trim()) {
        habit.notes.push({
          text: note.trim(),
        });
      }

      console.log("Notes:", habit.notes);
    }
    habit.streak = habit.calculateStreak();
    await habit.save();
    res.json({ habit });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});
//for notes
router.delete("/:habitId/notes/:noteId", authMiddleware, async (req, res) => {
  try {
    const { habitId, noteId } = req.params;

    const habit = await Habit.findOne({
      _id: habitId,
      userId: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    habit.notes = habit.notes.filter((note) => note._id.toString() !== noteId);

    await habit.save();

    res.json({ habit });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/:id/notes", authMiddleware, async (req, res) => {
  try {
    const { note } = req.body;

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!habit) return res.status(404).json({ message: "Not found" });

    if (!note?.trim()) {
      return res.status(400).json({ message: "Empty note" });
    }

    habit.notes.push({
      text: note.trim(),
    });

    await habit.save();

    res.json({ habit });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
