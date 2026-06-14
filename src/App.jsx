import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DiseaseDetection from './pages/DiseaseDetection'
import Advisory from './pages/Advisory'
import History from './pages/History'
import About from './pages/About'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/advisory" element={<Advisory />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
