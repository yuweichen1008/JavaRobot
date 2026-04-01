import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SimulatorPage } from './pages/SimulatorPage'
import { JourneyPage } from './pages/JourneyPage'
import { useRobotSocket } from './hooks/useRobotSocket'
import './App.css'

function AppInner() {
  useRobotSocket()
  return (
    <Routes>
      <Route path="/" element={<SimulatorPage />} />
      <Route path="/journey" element={<JourneyPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
