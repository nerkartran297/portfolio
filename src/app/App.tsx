import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { MuiThemeProvider } from "../theme";
import { store } from "../store";
import { router } from "./routes";
import "../styles.css";

export default function App() {
  return (
    <Provider store={store}>
      <MuiThemeProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </MuiThemeProvider>
    </Provider>
  );
}
