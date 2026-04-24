import { Navigate, Route, Routes } from 'react-router-dom'
import Cadastro from './components/Cadastro'
import InvoiceDashboard from './components/InvoiceDashboard'
import Login from './components/Login'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/faturas" element={<InvoiceDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
