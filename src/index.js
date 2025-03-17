import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/poppins";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
