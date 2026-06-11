import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import '../styles/global.css'
import '../styles/buttons.css'
import '../styles/gamification.css'

export default function Login() {
  const navigate = useNavigate()
  const { lang, m, t, toggleLang } = useLanguage()
  const g = m.gamification.login

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Проверяем, авторизован ли уже пользователь
  useEffect(() => {
    fetch('/api/gamification/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          navigate('/dashboard', { replace: true })
        }
      })
      .catch(() => {})
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/gamification/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка входа')
      }

      // После успешного логина переходим в дашборд
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="g-page">
      <header className="navbar">
        <div className="container navbar-inner">
          <a href="/" className="logo logo--brand">
            <img
              src="/assets/logo-kids.png"
              alt=""
              className="logo__img"
              width={120}
              height={44}
              loading="eager"
            />
            <span className="logo__sub">{m.nav.logoSub}</span>
          </a>
          <div className="navbar-actions">
            <button type="button" className="btn-lang" onClick={toggleLang}>
              {t('langSwitch')}
            </button>
          </div>
        </div>
      </header>

      <div className="g-container" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div className="g-login-card">
          <h1 className="g-login-logo">{g.title}</h1>
          <p className="g-login-sub">{g.sub}</p>

          {error && <div className="g-login-error">{error}</div>}

          <form className="g-login-form" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username">{g.user}</label>
              <input
                id="username"
                className="g-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password">{g.pass}</label>
              <input
                id="password"
                className="g-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <p className="g-tx-desc" style={{ marginTop: '0.2rem', textAlign: 'center' }}>
              {g.childHint}
            </p>

            <button type="submit" className="btn-primary g-login-btn" disabled={loading}>
              {loading ? m.cta.sending : g.btn}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
