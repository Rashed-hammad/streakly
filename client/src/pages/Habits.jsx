import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Plus, Loader2 } from "lucide-react";
import HabitsList from "../components/HabitsList";
import AddNewHabit from "../components/AddNewHabit";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
const BASE_URL = import.meta.env.VITE_API_URL;

const Habits = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [habits, setHabits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: "", description: "" });
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  const handleAddHabit = async () => {
    try {
      await axios.post(`${BASE_URL}/api/habits`, newHabit, {
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
      const response = await axios.get(`${BASE_URL}/api/habits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHabits(response.data.habits);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className="rounded-2xl bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text">Your Habits</h2>
          <div className="flex gap-2">
            <span className="rounded-lg bg-primary/10 px-5 py-2 text-primary text-lg">
              {habits.length} Habits
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={20} />
              New Habit
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-50">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <HabitsList habits={habits} fetchHabits={fetchHabits} />
        )}
      </div>

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

export default Habits;
