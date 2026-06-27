import { useState } from "react";
import {
  Trash,
  CircleCheck,
  Ban,
  Search,
  ArrowDownWideNarrow,
  Pencil,
} from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_URL;

import axios from "axios";
import { useAuth } from "../context/AuthContext";
import HabitDetails from "./HabitDetails";

const HabitsList = ({ habits, fetchHabits }) => {
  const { token } = useAuth();
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showCompletedFirst, setShowCompletedFirst] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit state
  const [editModal, setEditModal] = useState(false);
  const [editHabitId, setEditHabitId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const filteredHabits = habits.filter((habit) =>
    `${habit.title} ${habit.description || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (habitId) => {
    try {
      await axios.delete(`${BASE_URL}/api/habits/${habitId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHabits();
    } catch (error) {
      console.error(error);
    }
  };

  const isCompletedToday = (completions) => {
    const today = new Date().toDateString();
    return completions.some((date) => new Date(date).toDateString() === today);
  };

  const sortedHabits = [...filteredHabits].sort((a, b) => {
    const aCompleted = isCompletedToday(a.completions);
    const bCompleted = isCompletedToday(b.completions);
    return showCompletedFirst
      ? Number(bCompleted) - Number(aCompleted)
      : Number(aCompleted) - Number(bCompleted);
  });

  const handleComplete = async (habitId) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/habits/${habitId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchHabits();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async () => {
    if (!editTitle.trim()) return;
    try {
      await axios.put(
        `${BASE_URL}/api/habits/${editHabitId}`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setEditModal(false);
      fetchHabits();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mx-auto mb-6 flex w-full max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between"></div>
      <div className="flex justify-end gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-muted/30 bg-surface py-2 pl-10 pr-4 text-text placeholder:text-muted shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() => setShowCompletedFirst(!showCompletedFirst)}
          className="flex items-center gap-2 rounded-xl border border-muted/30 bg-surface px-3 py-2 text-text shadow-sm transition hover:bg-background"
        >
          <ArrowDownWideNarrow size={18} />
          <span className="text-sm">
            {showCompletedFirst ? "Completed First" : "Pending First"}
          </span>
        </button>
      </div>

      <div className="mb-4 flex justify-end"></div>

      {habits.length === 0 ? (
        <div className="rounded-2xl bg-surface p-10 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-text">No habits yet</h3>
          <p className="mt-2 text-muted">
            Create your first habit and start building a streak.
          </p>
        </div>
      ) : (
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-4">
          {sortedHabits.map((habit) => (
            <li
              key={habit._id}
              onClick={() => setSelectedHabit(habit)}
              className={`w-full max-w-sm h-45 cursor-pointer rounded-2xl bg-surface border border-slate-200 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                isCompletedToday(habit.completions)
                  ? "border-l-4 border-l-success"
                  : "border-l-4 border-l-danger"
              }`}
            >
              <div className="flex items-start justify-between">
                {/* Habit Info */}
                <div className="flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-text">{habit.title}</h2>
                  <p className="mt-1 text-muted h-10">
                    {habit.description || "No description"}
                  </p>
                  <p className="mt-4 text-sm text-muted">
                    Last completed:{" "}
                    <span className="font-medium text-text">
                      {habit.completions.at(-1)
                        ? new Date(
                            habit.completions.at(-1),
                          ).toLocaleDateString()
                        : "Never"}
                    </span>
                  </p>
                  <p className="mt-1 font-medium text-text flex-8">
                    🔥 {habit.streak} {habit.streak === 1 ? "day" : "days"}
                  </p>
                </div>

                {/* Status + Actions */}
                <div className="ml-4 flex flex-col items-end justify-between gap-20">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isCompletedToday(habit.completions)
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {isCompletedToday(habit.completions)
                      ? "Completed"
                      : "Pending"}
                  </span>

                  <div className="flex gap-3">
                    {isCompletedToday(habit.completions) ? (
                      <Ban
                        className="cursor-pointer text-danger transition-transform hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComplete(habit._id);
                        }}
                      />
                    ) : (
                      <CircleCheck
                        className="cursor-pointer text-success transition-transform hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComplete(habit._id);
                        }}
                      />
                    )}

                    <Pencil
                      className="cursor-pointer text-primary transition-transform hover:scale-110 hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditHabitId(habit._id);
                        setEditTitle(habit.title);
                        setEditDescription(habit.description || "");
                        setEditModal(true);
                      }}
                    />

                    <Trash
                      className="cursor-pointer text-danger transition-transform hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(habit._id);
                      }}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedHabit && (
        <HabitDetails
          fetchHabits={fetchHabits}
          habit={selectedHabit}
          onClose={() => setSelectedHabit(null)}
          isCompletedToday={isCompletedToday}
        />
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-text">Edit Habit</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Habit title"
              className="w-full rounded-xl border border-muted/30 px-4 py-2 mb-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full h-24 rounded-xl border border-muted/30 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 rounded-xl border border-muted/30 text-text transition hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsList;
