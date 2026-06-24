import { Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/register";
import Analytics from "./pages/Analytics";
import Habits from "./pages/Habits";
function App() {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
