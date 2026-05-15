import { useEffect } from 'react'
import { SALES_OPERATORS } from '../data/salesOperators.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function ContactSuccessModal({ open, onClose }) {
  const { lang, m } = useLanguage()
  const s = m.successModal
  const scrollSrc = lang === 'ro' ? '/assets/ro_form.png' : '/assets/form.png'

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="success-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={scrollSrc}
          className="success-modal__scroll"
          src={scrollSrc}
          alt=""
          width={480}
          height={920}
          draggable={false}
        />

        <button type="button" className="success-modal__close" onClick={onClose} aria-label={s.close}>
          ×
        </button>

        <div className="success-modal__panel">
          <div id="success-modal-title" className="success-modal__head">
            <p className="success-modal__line">{s.line1}</p>
            <p className="success-modal__line">{s.line2}</p>
            <p className="success-modal__line success-modal__line--brand">{s.brand}</p>
          </div>
          <p className="success-modal__wait">{s.wait}</p>
          <p className="success-modal__cta">{s.cta}</p>
          <p className="success-modal__limited">{s.limited}</p>
          <div className="success-modal__phones">
            {SALES_OPERATORS.map((op, i) => (
              <a key={op.telHref} href={`tel:${op.telHref}`} className="success-modal__phone">
                <span className="success-modal__phone-label">
                  {s.operator} {i + 1}
                </span>
                <span className="success-modal__phone-num">{op.display}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
