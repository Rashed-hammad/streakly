import { Ban, CircleCheck } from "lucide-react";

const HabitDetails = ({ habit, onClose, isCompletedToday }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-text">{habit.title}</h2>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isCompletedToday(habit.completions)
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}
          >
            {isCompletedToday(habit.completions) ? "Done today" : "Not done"}
          </span>
        </div>

        {/* Description */}
        <p className="mt-2 text-muted">
          {habit.description || "No description"}
        </p>
        <p className="mt-2 text-muted">
          {habit.createdAt
            ? new Date(habit.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Never"}
        </p>
        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-background p-4 border border-slate-200">
            <p className="text-xs text-muted">Current Streak</p>
            <p className="mt-1 text-2xl font-bold text-success">
              🔥 {habit.streak}
            </p>
          </div>

          <div className="rounded-xl bg-background p-4 border border-slate-200">
            <p className="text-xs text-muted">Total Completions</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {habit.completions.length} ✅
            </p>
          </div>
        </div>

        {/* Last Completed */}
        <div className="mt-4 rounded-xl bg-background p-4 border border-slate-200">
          <p className="text-xs text-muted">Last Completed</p>

          <p className="mt-1 text-sm font-medium text-text">
            {habit.completions.at(-1)
              ? new Date(habit.completions.at(-1)).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Never"}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HabitDetails;
