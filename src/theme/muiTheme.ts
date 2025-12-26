import { createTheme } from "@mui/material/styles";
import type { ThemeMode } from "../store/themeSlice";

export const createMuiTheme = (mode: ThemeMode) => {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? "rgb(54, 120, 255)" : "rgb(54, 120, 255)",
      },
      secondary: {
        main: isDark ? "rgb(255, 87, 179)" : "rgb(255, 87, 179)",
      },
      background: {
        default: isDark ? "rgb(6, 10, 22)" : "rgb(250, 250, 255)",
        paper: isDark ? "rgba(10, 22, 48, 0.52)" : "rgba(255, 255, 255, 0.8)",
      },
      text: {
        primary: isDark ? "rgb(235, 242, 255)" : "rgb(20, 20, 30)",
        secondary: isDark ? "rgba(235, 242, 255, 0.72)" : "rgba(20, 20, 30, 0.72)",
      },
      divider: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backdropFilter: "blur(14px)",
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.10)" : "rgba(0, 0, 0, 0.10)"}`,
            boxShadow: isDark
              ? "0 14px 44px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
              : "0 14px 44px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 16,
              borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
              "& fieldset": {
                borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
                borderWidth: 1,
              },
              "&:hover fieldset": {
                borderColor: isDark ? "rgba(255, 255, 255, 0.20)" : "rgba(0, 0, 0, 0.20)",
              },
              "&.Mui-focused fieldset": {
                borderColor: isDark ? "rgba(74, 210, 255, 0.6)" : "rgba(54, 120, 255, 0.6)",
              },
            },
            "& .MuiInputBase-input": {
              color: isDark ? "rgb(235, 242, 255)" : "rgb(20, 20, 30)",
            },
            "& .MuiInputLabel-root": {
              color: isDark ? "rgba(235, 242, 255, 0.72)" : "rgba(20, 20, 30, 0.72)",
            },
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            overflow: "hidden",
            "& .MuiTableHead-root": {
              "& .MuiTableCell-root": {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
                borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
                color: isDark ? "rgba(240, 200, 120, 0.88)" : "rgba(120, 100, 60, 0.9)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.28em",
                fontSize: "0.75rem",
              },
            },
            "& .MuiTableBody-root": {
              "& .MuiTableCell-root": {
                borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                color: isDark ? "rgb(235, 242, 255)" : "rgb(20, 20, 30)",
              },
              "& .MuiTableRow-root": {
                "&:hover": {
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                },
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            background: isDark
              ? "rgba(10, 18, 40, 0.85)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: 600,
            letterSpacing: "0.04em",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
            },
          },
          outlined: {
            borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
            borderWidth: 1,
            "&:hover": {
              borderColor: isDark ? "rgba(255, 255, 255, 0.20)" : "rgba(0, 0, 0, 0.20)",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.10)" : "rgba(0, 0, 0, 0.05)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"}`,
            "&:hover": {
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.10)",
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 16,
            },
          },
          paper: {
            borderRadius: 16,
            backdropFilter: "blur(14px)",
            background: isDark ? "rgba(10, 22, 48, 0.95)" : "rgba(255, 255, 255, 0.95)",
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"}`,
          },
        },
      },
    },
  });
};

