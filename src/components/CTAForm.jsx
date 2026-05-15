import { useState } from 'react'
import ContactSuccessModal from './ContactSuccessModal'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import '../styles/success-modal.css'

export default function CTAForm() {
  const { lang, m } = useLanguage()
  const c = m.cta
  const panelBg = lang === 'ro' ? '/assets/bg_form_ro.png' : '/assets/bg_form_ru.png'
  const [loading, setLoading] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

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

              <button className="btn-primary" disabled={loading} type="submit">
                {loading ? c.sending : c.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
