import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Cadastro from "./components/Cadastro";
import InvoiceDashboard from "./components/InvoiceDashboard";
import Login from "./components/Login";
import "./App.css";

const tokenout = localStorage.getItem("token");
function App() {
  const [token, setToken] = useState(tokenout);

  const handleToken = (t) => setToken(t);

  return (
    <Routes>
      <Route path="/" element={<Login handleToken={handleToken} />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/faturas" element={<InvoiceDashboard token={token} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
