import { useEffect, useRef } from 'react'
import Parallax from 'parallax-js'

/**
 * Сцена «red parallax» (по мотивам red-paralax/index.html) + Parallax.js.
 * Картинки: public/red-paralax/images/ (скачаны с демо wagerfield).
 */
export default function HeroParallaxScene() {
  const sceneRef = useRef(null)
  const parallaxRef = useRef(null)

  useEffect(() => {
    const el = sceneRef.current
    if (!el) return

    const heroEl = document.getElementById('top')
    const px = new Parallax(el, {
      relativeInput: true,
      clipRelativeInput: true,
      hoverOnly: false,
      frictionX: 0.1,
      frictionY: 0.1,
      scalarX: 25,
      scalarY: 15,
      inputElement: heroEl || undefined,
    })
    parallaxRef.current = px

    const resize = () => {
      const parent = el.parentElement
      if (!parent) return
      el.style.width = `${parent.offsetWidth}px`
      el.style.height = `${parent.offsetHeight}px`
    }

    resize()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      px.destroy()
      parallaxRef.current = null
    }
  }, [])

  return (
    <div
      ref={sceneRef}
      className="hero-red-parallax__scene"
    >
      <div className="hero-red-parallax__layer" data-depth="0" aria-hidden="true" />

      <div className="hero-red-parallax__layer" data-depth="0.1">
        <div className="hero-red-parallax__background" />
      </div>

      <div className="hero-red-parallax__layer" data-depth="0.1">
        <div className="hero-red-parallax__light hero-red-parallax__light--orange hero-red-parallax__light--b hero-red-parallax__phase-4" />
      </div>
      <div className="hero-red-parallax__layer" data-depth="0.1">
        <div className="hero-red-parallax__light hero-red-parallax__light--purple hero-red-parallax__light--c hero-red-parallax__phase-5" />
      </div>
      <div className="hero-red-parallax__layer" data-depth="0.1">
        <div className="hero-red-parallax__light hero-red-parallax__light--orange hero-red-parallax__light--d hero-red-parallax__phase-3" />
      </div>

      <div className="hero-red-parallax__layer" data-depth="0.15">
        <ul className="hero-red-parallax__rope hero-red-parallax__rope--depth-10">
          <li>
            <img src="/red-paralax/images/rope.png" alt="" />
          </li>
          <li className="hero-red-parallax__hanger hero-red-parallax__hanger--2">
            <div className="hero-red-parallax__board hero-red-parallax__board--cloud-2 hero-red-parallax__swing-1" />
          </li>
          <li className="hero-red-parallax__hanger hero-red-parallax__hanger--4">
            <div className="hero-red-parallax__board hero-red-parallax__board--cloud-1 hero-red-parallax__swing-3" />
          </li>
          <li className="hero-red-parallax__hanger hero-red-parallax__hanger--8">
            <div className="hero-red-parallax__board hero-red-parallax__board--birds hero-red-parallax__swing-5" />
          </li>
        </ul>
      </div>

      <div className="hero-red-parallax__layer" data-depth="0.3">
        <ul className="hero-red-parallax__rope hero-red-parallax__rope--depth-30">
          <li>
            <img src="/red-paralax/images/rope.png" alt="" />
          </li>
          <li className="hero-red-parallax__hanger hero-red-parallax__hanger--1">
            <div className="hero-red-parallax__board hero-red-parallax__board--cloud-1 hero-red-parallax__swing-3" />
          </li>
          <li className="hero-red-parallax__hanger hero-red-parallax__hanger--5">
            <div className="hero-red-parallax__board hero-red-parallax__board--cloud-4 hero-red-parallax__swing-1" />
          </li>
        </ul>
      </div>

      <div className="hero-red-parallax__layer" data-depth="0.3">
        <div className="hero-red-parallax__wave hero-red-parallax__wave--paint hero-red-parallax__wave--d30" />
      </div>
      <div className="hero-red-parallax__layer" data-depth="0.4">
        <div className="hero-red-parallax__wave hero-red-parallax__wave--plain hero-red-parallax__wave--d40" />
      </div>
      <div className="hero-red-parallax__layer" data-depth="0.5">
        <div className="hero-red-parallax__wave hero-red-parallax__wave--paint hero-red-parallax__wave--d50" />
      </div>
      <div className="hero-red-parallax__layer" data-depth="0.6">
        <div className="hero-red-parallax__lighthouse" />
      </div>
      <div className="hero-red-parallax__layer" data-depth="0.6">
        <ul className="hero-red-parallax__rope hero-red-parallax__rope--depth-60">
          <li>
            <img src="/red-paralax/images/rope.png" alt="" />
          </li>
          <li className="hero-red-parallax__hanger hero-red-parallax__hanger--3">
            <div className="hero-red-parallax__board hero-red-parallax__board--birds hero-red-parallax__swing-5" />
          </li>
          <li className="hero-red-parallax__hanger hero-red-parallax__hanger--6">
            <div className="hero-red-parallax__board hero-red-parallax__board--cloud-2 hero-red-parallax__swing-2" />
          </li>
          <li className="hero-red-parallax__hanger hero-red-parallax__hanger--8">
            <div className="hero-red-parallax__board hero-red-parallax__board--cloud-3 hero-red-parallax__swing-4" />
          </li>
        </ul>
      </div>
      <div className="hero-red-parallax__layer" data-depth="0.6">
        <div className="hero-red-parallax__wave hero-red-parallax__wave--plain hero-red-parallax__wave--d60" />
      </div>
      <div className="hero-red-parallax__layer" data-depth="0.8">
        <div className="hero-red-parallax__wave hero-red-parallax__wave--plain hero-red-parallax__wave--d80" />
      </div>
      <div className="hero-red-parallax__layer" data-depth="1">
        <div className="hero-red-parallax__wave hero-red-parallax__wave--paint hero-red-parallax__wave--d100" />
      </div>
    </div>
  )
}
