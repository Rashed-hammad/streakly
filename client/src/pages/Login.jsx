import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      login(response.data.user, response.data.token);
      navigate("/home");
    } catch (error) {
      toast.error("Invalid credentials");
      console.error(error);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-background px-6 py-12 lg:px-8">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-bold text-primary">
          Streakly
        </h1>

        <h2 className="mt-6 text-center text-2xl font-bold text-text">
          Sign in to your account
        </h2>

        <p className="mt-2 text-center text-muted">
          Build better habits every day
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl bg-surface p-8 shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text"
              >
                Email address
              </label>

              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  className="block w-full rounded-xl border border-muted/20 bg-surface px-4 py-3 text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text"
              >
                Password
              </label>

              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-muted/20 bg-surface px-4 py-3 text-text placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Not a member?{" "}
            <a
              href="/register"
              className="font-semibold text-secondary transition hover:opacity-80"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
