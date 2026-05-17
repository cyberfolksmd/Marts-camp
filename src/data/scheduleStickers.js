/** PNG тем дня: public/assets/shedule/1.png … 10.png (неделя 1 → 1–5, неделя 2 → 6–10) */

export function scheduleStickerSrc(index) {
  const n = Math.floor(Number(index))
  if (!Number.isFinite(n) || n < 1 || n > 10) return null
  return `/assets/shedule/${n}.png`
}

export function scheduleStickerIndex(weekIndex, dayIndex) {
  const w = Math.floor(Number(weekIndex))
  const d = Math.floor(Number(dayIndex))
  if (!Number.isFinite(w) || !Number.isFinite(d) || w < 1 || w > 2 || d < 0 || d > 4) return null
  return (w - 1) * 5 + d + 1
}
