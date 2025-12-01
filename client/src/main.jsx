import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RecommendationProvider } from "./context/RecommendationContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecommendationProvider>
    <App />
  </RecommendationProvider>
);
