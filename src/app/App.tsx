import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/react-router";
import { store } from "../store/store";
import { useAppSelector } from "../store/hooks";
import { createMuiTheme } from "../theme/muiTheme";
import { router } from "./routes";
import "../styles.css";
import { useEffect } from "react";

function AppContent() {
  const mode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    const html = document.documentElement;
    if (mode === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  const theme = createMuiTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NuqsAdapter>
        <RouterProvider router={router} />
      </NuqsAdapter>
      <Toaster
        position="top-right"
        theme={mode}
        toastOptions={{
          style: {
            background: mode === "dark" ? "rgba(10, 22, 48, 0.95)" : "rgba(255, 255, 255, 0.95)",
            border: `1px solid ${mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"}`,
            backdropFilter: "blur(14px)",
            color: mode === "dark" ? "rgb(235, 242, 255)" : "rgb(20, 20, 30)",
          },
        }}
      />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
