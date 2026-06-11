import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Sales from './pages/Sales'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
