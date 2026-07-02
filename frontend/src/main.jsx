import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster }
from "react-hot-toast";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
<BrowserRouter>
  <AuthProvider>

    <Toaster
      position="top-right"
    />

    <App />

  </AuthProvider>
</BrowserRouter>
);