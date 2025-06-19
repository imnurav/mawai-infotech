import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/Admin";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/admin/login"
          element={
            isLoggedIn ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />

        <Route
          path="/admin"
          element={
            isLoggedIn ? <AdminPanel /> : <Navigate to="/admin/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
