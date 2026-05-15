import { SALES_OPERATORS, FOOTER_CLUB_ADDRESS } from '../data/salesOperators.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import Sticker from './Sticker.jsx'
import '../styles/success-modal.css'
import '../styles/footer.css'

export default function Footer() {
  const { m } = useLanguage()
  const s = m.successModal

  return (
    <footer className="footer">
      <Sticker index={5} className="footer-stick--d1 stickers-d-only footer-sticker" delaySec={0.1} />
      <Sticker index={6} className="footer-stick--d2 stickers-d-only footer-sticker" delaySec={0.4} />
      <Sticker index={11} className="footer-stick--m1 stickers-m-only footer-sticker" delaySec={0.2} />
      <Sticker index={12} className="footer-stick--m2 stickers-m-only footer-sticker" delaySec={0.5} />
      <div className="container footer__grid">
        <div className="footer__col footer__col--left">
          <p className="footer__tagline">{m.footer.tagline}</p>
          <p className="footer__address">{FOOTER_CLUB_ADDRESS}</p>
        </div>

        <div className="footer__col footer__col--center">
          <Sticker
            index={4}
            className="footer-stick--sales-title stickers-d-only footer-sticker"
            delaySec={0.28}
          />
          <h3 className="footer__sales-title">{m.footer.contactSales}</h3>
          <div className="success-modal__phones footer__phones">
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

        <div className="footer__col footer__col--thumb">
          <img
            src="/assets/childs.png"
            alt=""
            className="footer__kids-img"
            width={200}
            height={200}
            loading="lazy"
          />
        </div>

        <div className="footer__mobile-brand">
          <img
            src="/assets/childs.png"
            alt=""
            className="footer__kids-img footer__kids-img--mobile"
            width={160}
            height={160}
            loading="lazy"
          />
          <div className="footer__mobile-brand-text">
            <h3 className="footer__brand-title">{m.footer.title}</h3>
            <p className="footer__tagline footer__tagline--below">{m.footer.tagline}</p>
            <p className="footer__address">{FOOTER_CLUB_ADDRESS}</p>
          </div>
        </div>
      </div>

      <div className="container footer__credit-wrap">
        <p className="footer__credit">
          {m.footer.creditIntro}{' '}
          <a
            className="footer__credit-link"
            href="https://cyberfolks.md/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {m.footer.creditBrand}
          </a>
        </p>
      </div>
    </footer>
  )
}
