/** 12 PNG в public/assets/stickers/ — имена 1.png … 12.png */
export function stickerSrc(index) {
  const i = Math.floor(Number(index))
  const n = Number.isFinite(i) ? Math.min(12, Math.max(1, i)) : 1
  return `/assets/stickers/${n}.png`
}