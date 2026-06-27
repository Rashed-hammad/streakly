import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  Line,
  LineChart,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [habits, setHabits] = useState([]);
  const { token } = useAuth();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const tickColor = isDark ? "#94a3b8" : "#6B7280";
  const tooltipStyle = {
    borderRadius: "12px",
    border: "none",
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    color: isDark ? "#f8fafc" : "#0f172a",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const getLast7Days = (habits) => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en", { weekday: "short" });
      const completions = habits.filter((habit) =>
        habit.completions.includes(dateStr),
      ).length;
      return { day: dayName, completions };
    });
  };

  const getLast30Days = (habits) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return habits.map((habit) => {
      const completions = habit.completions.filter(
        (date) => new Date(date) >= thirtyDaysAgo,
      ).length;
      return { name: habit.title, completions };
    });
  };

  const getLast30DaysRate = (habits) => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      });
      const completed = habits.filter((h) =>
        h.completions.includes(dateStr),
      ).length;
      const rate =
        habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
      return { day: dayName, rate };
    });
  };

  const fetchHabits = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/habits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(response.data.habits);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);
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
  return (
    <div className="min-h-screen bg-background">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Navbar setSidebarOpen={setSidebarOpen} />
      <div className="mb-8 grid gap-4 md:grid-cols-3 mt-15 p-6">
        <div className="rounded-2xl bg-surface p-6 shadow-sm">
          <p className="text-sm text-muted">Total Habits</p>
          <h2 className="mt-2 text-3xl font-bold text-text">{habits.length}</h2>
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
      <div className="p-6">
        <div className="bg-surface rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text">
              Weekly Habit Completion
            </h2>
            <p className="text-sm text-muted">
              Number of completed habits during the last 7 days
            </p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={getLast7Days(habits)}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <XAxis
                dataKey="day"
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, habits.length]}
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(99,102,241,0.08)" }}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="completions" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div className="bg-surface rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text">
              Monthly Habit Completion
            </h2>
            <p className="text-sm text-muted">
              Number of completed times during the last 30 days of each habit
            </p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={getLast30Days(habits)}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 30]}
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={true}
                tickLine={true}
              />
              <Tooltip
                cursor={{ fill: "rgba(99,102,241,0.08)" }}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="completions" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text">
              Daily Completion Rate
            </h2>
            <p className="text-sm text-muted">
              Your habit completion rate (%) over the last 30 days
            </p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={getLast30DaysRate(habits)}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <XAxis
                dataKey="day"
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={true}
                tickLine={true}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "Completion Rate"]}
                cursor={{ fill: "rgba(99,102,241,0.08)" }}
                contentStyle={tooltipStyle}
              />
              <Line
                dataKey="rate"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#6366f1", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
