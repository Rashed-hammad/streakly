import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completions: [{ type: String }],
    streak: { type: Number, default: 0 },
  },
  { timestamps: true },
);
habitSchema.methods.calculateStreak = function () {
  if (!this.completions || this.completions.length === 0) return 0;

  const dates = [...new Set(this.completions)].sort().reverse(); // latest first, already ISO so sort works

  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (let dateStr of dates) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    const diff = (current - date) / (1000 * 60 * 60 * 24);

    if (diff <= 1) {
      streak++;
      current = date;
    } else {
      break;
    }
  }

  return streak;
};
const Habit = mongoose.model("Habit", habitSchema);
export default Habit;
