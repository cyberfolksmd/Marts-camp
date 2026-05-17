import { useState } from 'react'
import ContactSuccessModal from './ContactSuccessModal'
import PrivacyPolicyModal from './PrivacyPolicyModal'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import '../styles/success-modal.css'
import '../styles/policy-modal.css'

export default function CTAForm() {
  const { lang, m } = useLanguage()
  const c = m.cta
  const panelBg = lang === 'ro' ? '/assets/bg_form_ro.png' : '/assets/bg_form_ru.png'
  const [loading, setLoading] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [policyOpen, setPolicyOpen] = useState(false)
  const [consent, setConsent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!consent) return

    setLoading(true)

    const form = new FormData(e.target)

    const payload = {
      name: form.get('name'),
      phone: form.get('phone'),
      age: form.get('age'),
    }

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        e.target.reset()
        setConsent(false)
        setSuccessOpen(true)
      } else {
        alert(c.errorSend)
      }
    } catch (err) {
      alert(c.errorServer)
    }

    setLoading(false)
  }

  return (
    <section className="cta-form" id="contact" aria-label={c.title}>
      <ContactSuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
      <PrivacyPolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />

      <div className="container">
        <div className="cta-form__panel">
          <img className="cta-form__panel-bg" src={panelBg} alt="" />
          <div className="cta-form__panel-body">
            <form className="cta-form__form" onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder={c.namePh} required />

              <input type="text" name="phone" placeholder={c.phonePh} required />

              <select name="age" defaultValue="5-8">
                <option value="5-8">{c.age58}</option>
                <option value="9-13">{c.age913}</option>
              </select>

              <div className="cta-form__consent">
                <label className="cta-form__consent-toggle">
                  <input
                    type="checkbox"
                    name="consent"
                    className="cta-form__consent-input"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-label={c.consentLabel}
                  />
                  <span className="cta-form__consent-box" aria-hidden="true" />
                </label>
                <span
                  role="button"
                  tabIndex={0}
                  className="cta-form__consent-link"
                  onClick={() => setPolicyOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setPolicyOpen(true)
                    }
                  }}
                >
                  {c.consentLabel}
                </span>
              </div>

              <button
                className="btn-primary"
                disabled={loading || !consent}
                type="submit"
              >
                {loading ? c.sending : c.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
