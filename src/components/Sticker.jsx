import { stickerSrc } from '../data/stickers.js'

/**
 * Внешний блок — позиция; внутри — покачивание как у шляпы (transform только на внутреннем).
 * @param {{ index: number, className?: string, delaySec?: number }} props
 */
export default function Sticker({ index, className = '', delaySec = 0 }) {
  return (
    <div className={`stick-deco ${className}`.trim()}>
      <div className="sticker-sway-wrap" style={{ animationDelay: `${delaySec}s` }}>
        <img
          src={stickerSrc(index)}
          alt=""
          className="sticker-sway__img"
          width={120}
          height={120}
          loading="lazy"
          draggable={false}
        />
      </div>
    </div>
  )
}
