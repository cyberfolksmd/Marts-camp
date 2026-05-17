import { scheduleStickerIndex, scheduleStickerSrc } from '../data/scheduleStickers.js'

export default function WeekSection({ id, meta, days, labels, weekIndex }) {
  const colCount = days.length + 1
  return (
    <section className="week-section" id={id}>
      <div className="container">
        <div className="schedule-card">
          <div className="schedule-table__head">
            <h2 className="schedule-table__head-title">{meta.title}</h2>
          </div>

          <div className="schedule-table-wrap">
            <table
              className={
                weekIndex === 1 ? 'schedule-table schedule-table--week1' : 'schedule-table'
              }
            >
              <colgroup>
                <col className="schedule-table__col-corner" />
                {days.map((d, dayIndex) => (
                  <col
                    key={`${d.dayFull}-col`}
                    className={[
                      'schedule-table__col-day',
                      weekIndex === 1 && dayIndex < 3 && 'schedule-table__col-day--shrink',
                      weekIndex === 1 && dayIndex === 3 && 'schedule-table__col-day--pirates',
                      weekIndex === 1 && dayIndex === 4 && 'schedule-table__col-day--kinomania',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th className="schedule-table__corner" scope="col" />
                  {days.map((d) => (
                    <th key={d.dayFull} className="schedule-table__day" scope="col">
                      <span className="schedule-table__day-short">{d.dayShort}</span>
                      <span className="schedule-table__day-full">{d.dayFull}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="schedule-table__row-theme">
                  <th scope="row" className="schedule-table__row-label">
                    {labels.themeRow}
                  </th>
                  {days.map((d, dayIndex) => {
                    const themeLines = d.theme.split('\n')
                    const stickerN = scheduleStickerIndex(weekIndex, dayIndex)
                    const stickerSrc = stickerN ? scheduleStickerSrc(stickerN) : null
                    const themeMods = []
                    if (themeLines.length >= 3) themeMods.push('schedule-table__theme--threeline')
                    else if (themeLines.length === 2) themeMods.push('schedule-table__theme--twoline')
                    if (weekIndex === 1) {
                      if (dayIndex === 0) themeMods.push('schedule-table__theme--w1-drop', 'schedule-table__theme--w1-lg')
                      if (dayIndex === 2) themeMods.push('schedule-table__theme--w1-drop', 'schedule-table__theme--w1-lg-sm')
                      if (dayIndex === 3) {
                        themeMods.push('schedule-table__theme--w1-drop-threeline', 'schedule-table__theme--pirates')
                      }
                    }
                    if (weekIndex === 2 && dayIndex === 2) {
                      themeMods.push('schedule-table__theme--w2-drop', 'schedule-table__theme--w2-lg')
                    }
                    const themeClass = ['schedule-table__theme', ...themeMods].join(' ')
                    return (
                      <td key={`${d.dayFull}-theme`} className={themeClass}>
                        <div className="schedule-table__theme-slot">
                          <div className="schedule-table__theme-body">
                            {themeLines.map((line, i) => (
                              <span key={i} className="schedule-table__theme-line">
                                {line}
                                {i < themeLines.length - 1 ? <br /> : null}
                              </span>
                            ))}
                          </div>
                          {stickerSrc ? (
                            <div className="schedule-table__theme-art">
                              <img
                                src={stickerSrc}
                                alt=""
                                className="schedule-table__theme-sticker"
                                width={128}
                                height={128}
                                loading="lazy"
                                draggable={false}
                              />
                            </div>
                          ) : null}
                        </div>
                      </td>
                    )
                  })}
                </tr>

                <tr className="schedule-table__row-band schedule-table__row-band--junior">
                  <th colSpan={colCount} scope="colgroup">
                    <span className="schedule-table__band-text">
                      {labels.juniorGroup}
                      <span className="schedule-table__band-age">{labels.ageJunior}</span>
                    </span>
                  </th>
                </tr>
                <tr className="schedule-table__row-junior">
                  <th scope="row" className="schedule-table__row-label schedule-table__row-label--junior">
                    {labels.artRow}
                  </th>
                  {days.map((d) => (
                    <td key={`${d.dayFull}-junior-art`} className="schedule-table__cell schedule-table__cell--junior">
                      {d.junior.art}
                    </td>
                  ))}
                </tr>
                <tr className="schedule-table__row-junior">
                  <th scope="row" className="schedule-table__row-label schedule-table__row-label--junior">
                    {labels.gamesRow}
                  </th>
                  {days.map((d) => (
                    <td key={`${d.dayFull}-junior-games`} className="schedule-table__cell schedule-table__cell--junior">
                      {d.junior.games}
                    </td>
                  ))}
                </tr>

                <tr className="schedule-table__row-band schedule-table__row-band--pro">
                  <th colSpan={colCount} scope="colgroup">
                    <span className="schedule-table__band-text">
                      {labels.proGroup}
                      <span className="schedule-table__band-age">{labels.agePro}</span>
                    </span>
                  </th>
                </tr>
                <tr className="schedule-table__row-pro">
                  <th scope="row" className="schedule-table__row-label schedule-table__row-label--pro">
                    {labels.artRow}
                  </th>
                  {days.map((d) => (
                    <td key={`${d.dayFull}-pro-art`} className="schedule-table__cell schedule-table__cell--pro">
                      {d.pro.art}
                    </td>
                  ))}
                </tr>
                <tr className="schedule-table__row-pro">
                  <th scope="row" className="schedule-table__row-label schedule-table__row-label--pro">
                    {labels.gamesRow}
                  </th>
                  {days.map((d) => (
                    <td key={`${d.dayFull}-pro-games`} className="schedule-table__cell schedule-table__cell--pro">
                      {d.pro.games}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
