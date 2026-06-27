import { useState } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
const BASE_URL = import.meta.env.VITE_API_URL;

const HabitDetails = ({ habit, onClose, isCompletedToday, fetchHabits }) => {
  const [timeFrame, setTimeFrame] = useState("all");
  const [notes, setNotes] = useState(habit.notes);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState("");

  const { token } = useAuth();

  const filteredCompletions = habit.completions.filter((date) => {
    if (timeFrame === "all") return true;
    const days = timeFrame === "week" ? 7 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(date) >= cutoff;
  });

  const handleDeleteNote = async (habitId, noteId) => {
    try {
      await axios.delete(`${BASE_URL}/habits/${habitId}/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      fetchHabits();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await axios.post(
        `${BASE_URL}/api/habits/${habit._id}/notes`,
        { note: newNote },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // optimistic update so modal re-renders immediately
      setNotes((prev) => [
        ...prev,
        { text: newNote, createdAt: new Date().toISOString() },
      ]);
      setNewNote("");
      setIsAddingNote(false);
      fetchHabits();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="w-full max-w-lg rounded-2xl bg-surface p-5 shadow-xl border border-slate-200"
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
        <p className="mt-1 text-muted">
          {habit.description || "No description"}
        </p>
        <p className="mt-1 text-muted">
          {habit.createdAt
            ? new Date(habit.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Never"}
        </p>

        {/* Stats */}
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-background p-4 border border-slate-200">
            <p className="text-xs text-muted">Current Streak</p>
            <p className="mt-1 text-2xl font-bold text-success">
              🔥 {habit.streak}
            </p>
          </div>
          <div className="rounded-xl bg-background p-4 border border-slate-200">
            <p className="text-xs text-muted">Last Completed</p>
            <p className="mt-1 text-sm font-medium text-text">
              {habit.completions.at(-1)
                ? new Date(habit.completions.at(-1)).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" },
                  )
                : "Never"}
            </p>
          </div>
          <div className="rounded-xl bg-background p-4 border border-slate-200">
            <p className="text-xs text-muted">Total Completions</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {habit.completions.length} ✅
            </p>
          </div>
        </div>

        {/* Completed Dates */}
        <div className="mt-3 rounded-xl bg-background p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted uppercase tracking-wide">
              Completed Dates
            </p>
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="rounded-lg border border-slate-200 bg-background px-3 py-1 text-sm text-text shadow-xs transition focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredCompletions.length > 0 ? (
              filteredCompletions.map((date, index) => (
                <span
                  key={index}
                  className="rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted">No completions yet</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-3 rounded-xl bg-background p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted uppercase tracking-wide">
              Notes
            </p>
            <button
              onClick={() => setIsAddingNote(true)}
              className="text-primary hover:opacity-70 transition cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Add note input */}
          {isAddingNote && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a note..."
                className="flex-1 rounded-lg border border-slate-200 bg-surface px-3 py-1.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                onClick={handleAddNote}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote("");
                }}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-muted hover:text-text transition"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Scroll container */}
          <div className="max-h-30 overflow-y-auto space-y-3 pr-2">
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary flex items-start justify-between gap-3"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{note.text}</span>
                    {note.createdAt && (
                      <span className="mt-1 text-xs text-muted">
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteNote(habit._id, note._id)}
                    className="text-red-400 hover:text-red-600 transition cursor-pointer shrink-0 mt-3"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No notes yet</p>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-primary px-4 py-4 font-semibold text-white transition hover:opacity-90"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HabitDetails;
