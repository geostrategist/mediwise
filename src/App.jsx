import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import DrugInfo from './pages/DrugInfo'
import HealthEdu from './pages/HealthEdu'
import BodyCheck from './pages/BodyCheck'

export default function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drugs" element={<DrugInfo />} />
        <Route path="/health" element={<HealthEdu />} />
        <Route path="/check" element={<BodyCheck />} />
      </Routes>
      <Footer />
    </HashRouter>
  )
}
