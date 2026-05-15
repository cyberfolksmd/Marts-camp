import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Navbar() {
  const { t, m, toggleLang } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className={`navbar${menuOpen ? ' nav--open' : ''}`}>
      <div className="container navbar-inner">
        <button
          type="button"
          className={`navbar-burger${menuOpen ? ' is-open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="navbar-site-menu"
          aria-label={menuOpen ? m.nav.menuCloseAria : m.nav.menuOpenAria}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="navbar-burger__bar" aria-hidden="true" />
          <span className="navbar-burger__bar" aria-hidden="true" />
          <span className="navbar-burger__bar" aria-hidden="true" />
        </button>

        <a href="#top" className="logo logo--stacked">
          <span className="logo__main">{m.nav.logoMain}</span>
          <span className="logo__sub">{m.nav.logoSub}</span>
        </a>

        <nav id="navbar-site-menu" aria-label={t('nav.navAria')} onClick={(e) => e.target.closest('a') && closeMenu()}>
          <a href="#program-intro">{t('nav.program')}</a>
          <a href="#week1">{t('nav.week1')}</a>
          <a href="#week2">{t('nav.week2')}</a>
          <a href="#benefits">{t('nav.benefits')}</a>
          <a href="#contact">{t('nav.contact')}</a>
        </nav>

        <div className="navbar-actions">
          <a className="btn-primary btn-primary--nav" href="#contact" onClick={closeMenu}>
            {t('nav.signup')}
          </a>
          <button type="button" className="btn-lang" onClick={toggleLang} aria-label={t('langSwitchAria')}>
            {t('langSwitch')}
          </button>
        </div>
      </div>
    </header>
  )
}
