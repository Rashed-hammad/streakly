import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const toggleDark = () => {
    const newVal = !isDark;
    setIsDark(newVal);
    localStorage.setItem("theme", newVal ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newVal);
  };
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
  };
  return (
    <AuthContext.Provider value={{ user, token, login, isDark, toggleDark }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
