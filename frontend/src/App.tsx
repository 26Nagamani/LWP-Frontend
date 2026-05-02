import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { adminRoutes } from "./routes/adminRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>

        <Route path="/" element={<Navigate to="/admin/topic" />} />

        <Route path="/admin" element={<AppLayout />}>
          {adminRoutes} 
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;