export default function WeekSection({ id, meta, days, labels }) {
  return (
    <section className="week-section" id={id}>
      <div className="container">
        <div className="schedule-card">
          <div className="schedule-table__head">
            <h2 className="schedule-table__head-title">{meta.title}</h2>
          </div>

          <div className="schedule-table-wrap">
            <table className="schedule-table">
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
                  {days.map((d) => (
                    <td key={`${d.dayFull}-theme`} className="schedule-table__theme">
                      {d.theme}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="schedule-table__row-label schedule-table__row-label--scout">
                    {labels.scouts}
                    <span className="schedule-table__age">{labels.ageScouts}</span>
                  </th>
                  {days.map((d) => (
                    <td key={`${d.dayFull}-scouts`} className="schedule-table__cell">
                      {d.scouts}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="schedule-table__row-label schedule-table__row-label--ranger">
                    {labels.rangers}
                    <span className="schedule-table__age">{labels.ageRangers}</span>
                  </th>
                  {days.map((d) => (
                    <td key={`${d.dayFull}-rangers`} className="schedule-table__cell">
                      {d.rangers}
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
