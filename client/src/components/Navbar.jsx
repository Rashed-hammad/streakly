import React from "react";
import { CircleUserRound, LogIn, LogOut, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setSidebarOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-surface px-6 py-4 shadow-sm">
      <Menu
        className="h-6 w-6 cursor-pointer text-text"
        onClick={() => setSidebarOpen(true)}
      />
      {/* Left - Date */}

      {/* Center - App Name */}
      <h1 className="text-xl font-bold tracking-wide text-primary">Streakly</h1>
      {/* Right - User */}
      <div className="flex items-center gap-3 text-muted">
        {user && (
          <div className="hidden lg:flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
            <CircleUserRound className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-text">
              {user.username}
            </span>
          </div>
        )}
        {user ? (
          <LogOut
            className="h-6 w-6 cursor-pointer text-danger transition hover:opacity-70"
            onClick={() => navigate("/")}
          />
        ) : (
          <button
            className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary hover:text-white active:scale-95"
            onClick={() => navigate("/")}
          >
            <LogIn className="h-5 w-5" />

            <span>Login</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
