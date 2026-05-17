import { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function PrivacyPolicyModal({ open, onClose }) {
  const { lang, m } = useLanguage()
  const src = lang === 'ro' ? '/assets/politica_ro.png' : '/assets/politica_ru.png'

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
    <div className="policy-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="policy-modal"
        role="dialog"
        aria-modal="true"
        aria-label={m.cta.policyModalAria}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="policy-modal__close"
          onClick={onClose}
          aria-label={m.successModal.close}
        >
          ×
        </button>
        <img
          className="policy-modal__img"
          src={src}
          alt={m.cta.policyModalAria}
          draggable={false}
        />
      </div>
    </div>
  )
}
