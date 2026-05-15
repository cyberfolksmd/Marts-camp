import { useLanguage } from '../i18n/LanguageContext.jsx'
import Sticker from './Sticker.jsx'

export default function Benefits() {
  const { m } = useLanguage()

  return (
    <section className="benefits-section" id="benefits">
      <Sticker index={3} className="benefits-stick--left stickers-d-only" delaySec={0.2} />
      <Sticker index={4} className="benefits-stick--right stickers-d-only" delaySec={0.65} />
      <Sticker index={9} className="benefits-stick--left stickers-m-only" delaySec={0.25} />
      <Sticker index={10} className="benefits-stick--right stickers-m-only" delaySec={0.5} />
      <div className="container">
        <div className="benefits-head">
          <h2 className="hero-ribbon">{m.benefits.woodTitle}</h2>
        </div>

        <div className="benefits-grid">
          {m.benefits.highlights.map((item, index) => (
            <div className="benefit-card" key={item.text}>
              <div className="benefit-icon" aria-hidden="true">
                <img
                  src={`/assets/icons/${index + 1}.png`}
                  alt=""
                  className="benefit-icon__img"
                  width={80}
                  height={80}
                  loading="lazy"
                />
              </div>
              <p className="benefit-card__text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
