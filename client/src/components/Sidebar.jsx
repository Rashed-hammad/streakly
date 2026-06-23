import {
  X,
  Calendar,
  LayoutDashboard,
  ListChecks,
  BarChart3,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, isDark, toggleDark } = useAuth();
  const navigate = useNavigate();
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const links = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/home",
    },
    {
      name: "Habits",
      icon: ListChecks,
      path: "/habits",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
  ];

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-200 bg-surface shadow-xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="border-b border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Streakly</h1>

            <X
              className="cursor-pointer text-muted transition hover:text-text"
              onClick={() => setSidebarOpen(false)}
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-background px-3 py-2">
            <Calendar size={18} className="text-primary" />

            <span className="text-sm font-medium text-text">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Navigation
          </p>

          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-md"
                        : "text-muted hover:bg-background hover:text-text"
                    }`
                  }
                >
                  <Icon size={20} />

                  <span className="font-medium">{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
          <button
            onClick={toggleDark}
            className="mt-30 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-muted transition-all hover:bg-background hover:text-text"
          >
            {isDark ? (
              <Sun size={20} color="yellow" />
            ) : (
              <Moon size={20} color="blue" />
            )}

            <span className="font-medium">
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>

            <div
              className={`ml-auto h-5 w-10 rounded-full p-0.5 transition  ${
                isDark ? "bg-primary" : "bg-slate-300"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  isDark ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 w-full border-t border-slate-200 p-4">
          <div className="mb-4 rounded-xl bg-primary/10 p-3">
            <p className="text-xs text-muted">Keep your streak alive 🔥</p>

            <p className="mt-1 text-sm font-semibold text-primary">
              One habit at a time.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-danger transition hover:bg-danger/10"
          >
            <LogOut size={20} />
            {user ? (
              <span className="font-medium">Logout</span>
            ) : (
              <span className="font-medium">Login</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
