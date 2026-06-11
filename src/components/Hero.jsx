import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import HeroParallaxScene from './HeroParallaxScene'
import RatingModal from './RatingModal.jsx'
import '../styles/hero-red-parallax.css'

export default function Hero() {
  const { lang, m } = useLanguage()
  const [ratingOpen, setRatingOpen] = useState(false)

  const heroH1Src = lang === 'ro' ? '/assets/hero_h1_ro.png' : '/assets/hero_h1.png'

  return (
    <section className="hero" id="top">
      <RatingModal open={ratingOpen} onClose={() => setRatingOpen(false)} />
      
      <div className="hero-red-parallax" aria-hidden="true">
        <HeroParallaxScene />
      </div>

      <div className="hero-content">
        <div className="hero-brand">
          <div className="hero-hat-wrap">
            <img src="/assets/marts-hat.png" alt="" className="hero-hat" width={220} height={140} />
          </div>

          <h1 className="hero-h1">
            <img
              key={heroH1Src}
              src={heroH1Src}
              alt={`${m.hero.title}. ${m.hero.subtitle}`}
              className="hero-h1__img"
              width={640}
              height={200}
            />
          </h1>
        </div>

        <p className="hero-ribbon">{m.hero.ribbon}</p>

        <div className="hero-buttons">
          <button type="button" className="btn-secondary" onClick={() => setRatingOpen(true)}>
            {m.hero.viewProgram}
          </button>
          <a className="btn-primary" href="#contact">
            {m.hero.signup}
          </a>
        </div>
      </div>
    </section>
  )
}
