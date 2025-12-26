import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "transparent",
      paper: "rgba(10, 18, 40, 0.52)",
    },
    text: {
      primary: "rgb(235, 242, 255)",
      secondary: "rgba(235, 242, 255, 0.72)",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          "& .MuiTableCell-head": {
            borderColor: "rgba(255, 255, 255, 0.12)",
            color: "rgba(240, 200, 120, 0.88)",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-body": {
            borderColor: "rgba(255, 255, 255, 0.12)",
            color: "rgb(235, 242, 255)",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255, 255, 255, 0.12)",
          padding: "12px 16px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(10, 18, 40, 1)",
            borderColor: "rgba(255, 255, 255, 0.10)",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.12)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.20)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(255, 255, 255, 0.30)",
            },
          },
          "& .MuiInputBase-input": {
            color: "rgb(235, 242, 255)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "0.75rem",
          borderColor: "rgba(255, 255, 255, 0.12)",
          "&.MuiButton-outlined": {
            borderColor: "rgba(255, 255, 255, 0.12)",
            color: "rgba(255, 255, 255, 0.80)",
            "&:hover": {
              borderColor: "rgba(255, 255, 255, 0.20)",
              backgroundColor: "rgba(255, 255, 255, 0.10)",
            },
          },
          "&.MuiButton-contained": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            color: "rgb(235, 242, 255)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.25)",
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(10, 22, 48, 0.95)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          borderRadius: "1rem",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "rgb(235, 242, 255)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: "rgb(235, 242, 255)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          color: "rgba(255, 255, 255, 0.75)",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            color: "rgba(255, 255, 255, 0.70)",
            "&.Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "rgb(235, 242, 255)",
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(10, 22, 48, 0.95)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.10)",
        },
        option: {
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.10)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.70)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.10)",
            color: "rgb(255, 255, 255)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(10, 18, 40, 1)",
          backgroundImage: "none",
        },
      },
    },
  },
});

// Light mode overrides
const lightTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: "light",
    background: {
      default: "transparent",
      paper: "rgba(255, 255, 255, 0.68)",
    },
    text: {
      primary: "rgb(18, 22, 32)",
      secondary: "rgba(18, 22, 32, 0.65)",
    },
    divider: "rgba(18, 22, 32, 0.12)",
  },
  components: {
    ...theme.components,
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          "& .MuiTableCell-head": {
            borderColor: "rgba(18, 22, 32, 0.12)",
            color: "rgba(18, 22, 32, 0.75)",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-body": {
            borderColor: "rgba(18, 22, 32, 0.12)",
            color: "rgb(18, 22, 32)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255, 255, 255, 1)",
            borderColor: "rgba(18, 22, 32, 0.08)",
            "& fieldset": {
              borderColor: "rgba(18, 22, 32, 0.12)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(18, 22, 32, 0.20)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(18, 22, 32, 0.30)",
            },
          },
          "& .MuiInputBase-input": {
            color: "rgb(18, 22, 32)",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(18, 22, 32, 0.08)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "rgb(18, 22, 32)",
          borderBottom: "1px solid rgba(18, 22, 32, 0.12)",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: "rgb(18, 22, 32)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "0.75rem",
          "&.MuiButton-outlined": {
            borderColor: "rgba(18, 22, 32, 0.25)",
            color: "rgb(18, 22, 32)",
            backgroundColor: "rgba(18, 22, 32, 0.03)",
            "&:hover": {
              borderColor: "rgba(18, 22, 32, 0.40)",
              backgroundColor: "rgba(18, 22, 32, 0.08)",
            },
          },
          "&.MuiButton-contained": {
            backgroundColor: "rgb(18, 22, 32)",
            color: "rgb(248, 249, 252)",
            "&:hover": {
              backgroundColor: "rgb(28, 32, 42)",
            },
          },
          "&.MuiButton-outlined.MuiButton-colorError": {
            borderColor: "rgba(211, 47, 47, 0.6)",
            color: "rgb(211, 47, 47)",
            backgroundColor: "rgba(211, 47, 47, 0.05)",
            "&:hover": {
              borderColor: "rgb(211, 47, 47)",
              backgroundColor: "rgba(211, 47, 47, 0.12)",
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "rgba(18, 22, 32, 0.70)",
          "&:hover": {
            backgroundColor: "rgba(18, 22, 32, 0.08)",
            color: "rgb(18, 22, 32)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(18, 22, 32, 0.04)",
          border: "1px solid rgba(18, 22, 32, 0.12)",
          color: "rgba(18, 22, 32, 0.70)",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            color: "rgba(18, 22, 32, 0.65)",
            "&.Mui-selected": {
              backgroundColor: "rgba(18, 22, 32, 0.12)",
              color: "rgb(18, 22, 32)",
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(18, 22, 32, 0.10)",
        },
        option: {
          "&:hover": {
            backgroundColor: "rgba(18, 22, 32, 0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 1)",
          backgroundImage: "none",
        },
      },
    },
  },
});

export function MuiThemeProvider({ children }: PropsWithChildren) {
  const [isLight, setIsLight] = useState(
    typeof window !== "undefined" &&
      document.documentElement.classList.contains("light")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains("light"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider theme={isLight ? lightTheme : theme}>
      {children}
    </ThemeProvider>
  );
}
