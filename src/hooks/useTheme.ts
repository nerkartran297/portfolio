import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "portfolio-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Đọc từ localStorage hoặc mặc định là dark
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return saved === "light" ? "light" : "dark";
  });

  useEffect(() => {
    const html = document.documentElement;
    
    // Dark mode: không có class (default)
    // Light mode: thêm class "light"
    if (theme === "light") {
      html.classList.add("light");
    } else {
      html.classList.remove("light");
    }

    // Lưu vào localStorage
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme, isLight: theme === "light" };
}

