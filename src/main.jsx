import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import All from "./pages/all.jsx";
import Finished from "./pages/finished.jsx";
import Doing from "./pages/doing.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        {/* 默认子路由 */}
        <Route index element={<All />} />
        <Route path="doing" element={<Doing />} />
        <Route path="finished" element={<Finished />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
