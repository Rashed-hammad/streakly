import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Plus } from "lucide-react";
import HabitsList from "../components/HabitsList";
import AddNewHabit from "../components/AddNewHabit";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [habits, setHabits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: "", description: "" });
  const { token } = useAuth();
  const highestStreak =
    habits.length > 0
      ? Math.max(...habits.map((habit) => habit.streak || 0))
      : 0;

  const completionsToday = habits.reduce((count, habit) => {
    const today = new Date().toDateString();
    if (
      habit.completions.some((date) => new Date(date).toDateString() === today)
    ) {
      return count + 1;
    }
    return count;
  }, 0);
  const handleAddHabit = async () => {
    try {
      await axios.post("http://localhost:3000/api/habits", newHabit, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewHabit({ title: "", description: "" });
      setShowModal(false);
      fetchHabits(); // refresh the list
    } catch (error) {
      console.error(error);
    }
  };
  const fetchHabits = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/habits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.habits);
      setHabits(response.data.habits);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Navbar setSidebarOpen={setSidebarOpen} />

      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text">Your Habits</h1>

            <p className="mt-2 text-muted">
              Stay consistent and build better habits every day.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <Plus size={20} />
            New Habit
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-surface p-6 shadow-sm">
            <p className="text-sm text-muted">Total Habits</p>
            <h2 className="mt-2 text-3xl font-bold text-text">
              {habits.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-surface p-6 shadow-sm">
            <p className="text-sm text-muted">Highest Streak</p>
            <h2 className="mt-2 text-3xl font-bold text-success">
              🔥 {highestStreak}
            </h2>
          </div>

          <div className="rounded-2xl bg-surface p-6 shadow-sm">
            <p className="text-sm text-muted">Completion Rate</p>

            <h2 className="mt-2 text-3xl font-bold text-secondary">
              {habits.length > 0
                ? Math.round((completionsToday / habits.length) * 100)
                : 0}
              %
            </h2>

            <p className="mt-1 text-sm text-muted">
              {completionsToday} / {habits.length} completed today
            </p>
          </div>
        </div>

        {/* Habits Section */}
        <div className="rounded-2xl bg-surface p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">Your Habits</h2>

            <span className="rounded-lg bg-primary/10 px-5 py-2 text-sm text-primary">
              {habits.length} Habits
            </span>
          </div>

          <HabitsList habits={habits} fetchHabits={fetchHabits} />
        </div>
      </main>

      <AddNewHabit
        showModal={showModal}
        setShowModal={setShowModal}
        newHabit={newHabit}
        setNewHabit={setNewHabit}
        handleAddHabit={handleAddHabit}
      />
    </div>
  );
};

export default Home;
