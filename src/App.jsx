// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import SpotPage from './pages/SpotPage'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/spot/:slug" element={<SpotPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}