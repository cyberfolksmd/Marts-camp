import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProgramIntro from '../components/ProgramIntro'
import WeekSection from '../components/WeekSection'
import Benefits from '../components/Benefits'
import CTAForm from '../components/CTAForm'
import Footer from '../components/Footer'
import Sticker from '../components/Sticker.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { schedules } from '../data/schedules.js'

import '../styles/global.css'
import '../styles/hero.css'
import '../styles/cards.css'
import '../styles/buttons.css'
import '../styles/animations.css'
import '../styles/form.css'
import '../styles/program-intro.css'
import '../styles/stickers.css'

export default function Home() {
  const { lang, m } = useLanguage()
  const s = schedules[lang]

  return (
    <div className="app">
      <Navbar />

      <Hero />

      <ProgramIntro />

      <div className="schedule-stick-wrap">
        <Sticker index={1} className="schedule-stick--left stickers-d-only" delaySec={0} />
        <Sticker index={2} className="schedule-stick--right stickers-d-only" delaySec={0.45} />
        <div className="schedule-bg-stack">
          <WeekSection
            id="week1"
            weekIndex={1}
            meta={s.week1.meta}
            days={s.week1.days}
            labels={m.schedule}
          />

          <WeekSection
            id="week2"
            weekIndex={2}
            meta={s.week2.meta}
            days={s.week2.days}
            labels={m.schedule}
          />
        </div>
      </div>

      <Benefits />

      <CTAForm />

      <Footer />
    </div>
  )
}
