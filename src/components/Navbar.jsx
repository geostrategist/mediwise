import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">🏥</div>
          <span className="navbar-logo-text">
            <span>智醫未來</span>
          </span>
        </Link>

        <ul className="navbar-nav">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">🏠</span>首頁
            </NavLink>
          </li>
          <li>
            <NavLink to="/drugs" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">💊</span>藥品資訊
            </NavLink>
          </li>
          <li>
            <NavLink to="/health" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">🏥</span>衛教資訊
            </NavLink>
          </li>
          <li>
            <NavLink to="/check" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">🩺</span>症狀分析
            </NavLink>
          </li>
          <li>
            <NavLink to="/ask" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="nav-icon">🤖</span>AI 問答
            </NavLink>
          </li>
        </ul>

        <div className="navbar-emergency">
          🚨 緊急：119
        </div>
      </div>
    </nav>
  )
}
