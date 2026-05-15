import { useLanguage } from '../i18n/LanguageContext.jsx'
import Sticker from './Sticker.jsx'

export default function ProgramIntro() {
  const { lang, m } = useLanguage()
  const p = m.programIntro
  const src = lang === 'ro' ? '/assets/2bg_site_ro.png' : '/assets/2bg_site.png'

  return (
    <section className="program-intro" id="program-intro" aria-label={p.sectionAria}>
      <Sticker index={7} className="program-stick--left stickers-m-only" delaySec={0.15} />
      <Sticker index={8} className="program-stick--right stickers-m-only" delaySec={0.55} />
      <img src={src} alt={p.imageAlt} className="program-intro__img" decoding="async" />
    </section>
  )
}
