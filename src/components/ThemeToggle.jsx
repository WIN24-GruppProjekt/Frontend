import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);

    setRotation((prev) => prev + 180);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <i className={`fa-solid fa-circle-half-stroke`}></i>
    </button>
  );
}
