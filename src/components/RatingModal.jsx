import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import '../styles/gamification.css'

export default function RatingModal({ open, onClose }) {
  const { lang, m } = useLanguage()
  const [rating, setRating] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    
    // Закрытие по ESC
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    
    // Отключение прокрутки страницы
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Загрузка рейтинга
    setLoading(true)
    fetch('/api/gamification/rating')
      .then((res) => res.json())
      .then((data) => {
        setRating(Array.isArray(data) ? data : [])
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  // Тексты локализации
  const isRo = lang === 'ro'
  const titleText = isRo ? 'Clasamentul MARTS CAMP' : 'Рейтинг MARTS CAMP'
  const nameLabel = isRo ? 'Nume' : 'Имя ребенка'
  const groupLabel = isRo ? 'Grupa' : 'Группа'
  const coinsLabel = isRo ? 'Balanță' : 'Рейтинг (монеты)'
  const closeText = isRo ? 'Închide' : 'Закрыть'
  const emptyText = isRo ? 'Niciun participant înregistrat' : 'Участников пока нет'

  return (
    <div className="g-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="g-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="g-modal-close"
          onClick={onClose}
          aria-label={closeText}
        >
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2
            className="g-login-logo"
            style={{
              fontSize: '1.75rem',
              marginBottom: '0.25rem',
              fontFamily: 'Cinzel, serif'
            }}
          >
            🏆 {titleText}
          </h2>
          <p className="g-tx-desc" style={{ color: 'rgba(250, 246, 239, 0.65)', fontSize: '0.85rem' }}>
            {isRo ? 'Cei mai activi cercetași ai taberei noastre' : 'Самые активные скауты нашего лагеря'}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--gold)' }}>
            <strong>Loading...</strong>
          </div>
        ) : rating.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'rgba(250, 246, 239, 0.4)' }}>
            {emptyText}
          </div>
        ) : (
          <div className="g-table-wrap" style={{ maxHeight: '380px', overflowY: 'auto' }}>
            <table className="g-table" style={{ fontSize: '0.9rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                  <th>{nameLabel}</th>
                  <th>{groupLabel}</th>
                  <th style={{ textAlign: 'right' }}>{coinsLabel}</th>
                </tr>
              </thead>
              <tbody>
                {rating.map((item, index) => {
                  const place = index + 1
                  let medal = ''
                  if (place === 1) medal = '🥇'
                  else if (place === 2) medal = '🥈'
                  else if (place === 3) medal = '🥉'
                  
                  return (
                    <tr
                      key={index}
                      style={{
                        background: place <= 3 ? 'rgba(212, 175, 55, 0.08)' : 'transparent'
                      }}
                    >
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {medal ? medal : place}
                      </td>
                      <td>
                        <strong style={{ color: place <= 3 ? 'var(--gold)' : 'var(--cream)' }}>
                          {item.name}
                        </strong>
                      </td>
                      <td>
                        <span
                          className={`g-kid-group ${item.age_group === '5-8' ? 'g-kid-group--scouts' : 'g-kid-group--rangers'}`}
                          style={{ margin: 0, fontSize: '0.65rem' }}
                        >
                          {item.age_group === '5-8' ? 'Scouts' : 'Rangers'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--gold)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end', width: '100%' }}>
                          <img src="/assets/coin.webp" alt="coin" style={{ width: '1.1rem', height: '1.1rem', objectFit: 'contain' }} />
                          {item.coins}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
