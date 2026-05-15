import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/sales.css'

const PAGE_SIZE = 20

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(value) {
  if (value == null) return ''
  const s = typeof value === 'string' ? value : String(value)
  return s.slice(0, 10)
}

function csvEscape(value) {
  const s = value == null ? '' : String(value)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

async function fetchJson(url, options) {
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || res.statusText)
    err.status = res.status
    throw err
  }
  return data
}

function buildListQuery(pageNum, scopeAll, dateFrom, dateTo) {
  const u = new URLSearchParams({ page: String(pageNum), pageSize: String(PAGE_SIZE) })
  if (scopeAll) u.set('scope', 'all')
  else {
    if (dateFrom) u.set('dateFrom', dateFrom)
    if (dateTo) u.set('dateTo', dateTo)
  }
  return u.toString()
}

export default function Sales() {
  const navigate = useNavigate()
  const [me, setMe] = useState(null)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState('')

  const [dateFrom, setDateFrom] = useState(todayISO)
  const [dateTo, setDateTo] = useState(todayISO)
  const [scopeAll, setScopeAll] = useState(false)
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [queryTick, setQueryTick] = useState(0)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)

  const filtersRef = useRef({ scopeAll, dateFrom, dateTo })
  filtersRef.current = { scopeAll, dateFrom, dateTo }

  const exportMenuRef = useRef(null)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const selectAllRef = useRef(null)

  const loadMe = useCallback(async () => {
    try {
      const data = await fetchJson('/api/admin/me')
      setMe(Boolean(data.admin))
    } catch {
      setMe(false)
    }
  }, [])

  const loadRows = useCallback(async (pageNum) => {
    const { scopeAll: sa, dateFrom: df, dateTo: dt } = filtersRef.current
    setListError('')
    setLoading(true)
    try {
      const qs = buildListQuery(pageNum, sa, df, dt)
      const data = await fetchJson(`/api/sales/camp?${qs}`)
      setRows(data.rows || [])
      setTotal(Number(data.total) || 0)
      setPage(Number(data.page) || pageNum)
      setSelectedIds(new Set())
    } catch (e) {
      if (e.status === 401) {
        setMe(false)
      } else {
        setListError(e.message || 'Ошибка загрузки')
      }
      setRows([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [])

  const bumpFilterReload = useCallback(() => {
    setScopeAll(false)
    setPage(1)
    setQueryTick((x) => x + 1)
  }, [])

  const selectedOnPage = useMemo(
    () => rows.filter((r) => selectedIds.has(r.id)),
    [rows, selectedIds]
  )
  const allVisibleSelected = rows.length > 0 && selectedOnPage.length === rows.length

  useLayoutEffect(() => {
    const el = selectAllRef.current
    if (!el) return
    el.indeterminate = selectedOnPage.length > 0 && !allVisibleSelected
  }, [selectedOnPage.length, allVisibleSelected])

  useEffect(() => {
    loadMe()
  }, [loadMe])

  useEffect(() => {
    if (me !== true) return
    loadRows(page)
  }, [me, page, loadRows, queryTick])

  useEffect(() => {
    if (!exportMenuOpen) return
    const onDoc = (e) => {
      const t = e.target
      if (exportMenuRef.current?.contains(t)) return
      setExportMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [exportMenuOpen])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      await fetchJson('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      })
      setPassword('')
      setMe(true)
      setPage(1)
      setScopeAll(false)
      const t = todayISO()
      setDateFrom(t)
      setDateTo(t)
    } catch (err) {
      setLoginError(err.status === 401 ? 'Неверный пароль' : err.message || 'Ошибка входа')
    }
  }

  const handleLogout = async () => {
    try {
      await fetchJson('/api/admin/logout', { method: 'POST', body: '{}' })
    } catch {
      /* ignore */
    }
    setMe(false)
    setRows([])
    setTotal(0)
    navigate('/sales', { replace: true })
  }

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadExport = async (fmt, queryString) => {
    try {
      const q = queryString ? `?${queryString}` : ''
      const res = await fetch(`/api/sales/export.${fmt}${q}`, { credentials: 'include' })
      if (!res.ok) {
        if (res.status === 401) setMe(false)
        return
      }
      const blob = await res.blob()
      downloadBlob(blob, `camp-${new Date().toISOString().slice(0, 10)}.${fmt}`)
    } catch {
      /* ignore */
    }
  }

  const handleSeeNew = () => {
    const t = todayISO()
    setScopeAll(false)
    setDateFrom(t)
    setDateTo(t)
    setPage(1)
    setQueryTick((x) => x + 1)
  }

  const handleViewAllRecords = () => {
    setScopeAll(true)
    setPage(1)
    setQueryTick((x) => x + 1)
  }

  const downloadAllRecords = () => {
    downloadExport('xlsx', 'all=1')
  }

  const downloadSelectedAs = async (fmt) => {
    const sel = rows.filter((r) => selectedIds.has(r.id))
    if (sel.length === 0) return
    setExportMenuOpen(false)
    const norm = sel.map((r) => ({
      id: r.id,
      date: formatDate(r.date),
      age: r.age,
      name: r.name,
      tel: r.tel,
      done: r.done,
    }))
    const stamp = new Date().toISOString().slice(0, 10)
    const header = ['id', 'date', 'age', 'name', 'tel', 'done']

    if (fmt === 'csv') {
      const lines = [
        header.join(','),
        ...norm.map((row) => header.map((h) => csvEscape(row[h])).join(',')),
      ]
      const csv = `\uFEFF${lines.join('\n')}`
      downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `camp-selected-${stamp}.csv`)
      return
    }

    const XLSX = await import('xlsx')
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(norm)
    XLSX.utils.book_append_sheet(wb, ws, 'selected')
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
    downloadBlob(
      new Blob([buf], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      `camp-selected-${stamp}.xlsx`
    )
  }

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        for (const r of rows) next.delete(r.id)
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        for (const r of rows) next.add(r.id)
        return next
      })
    }
  }

  const pages = useMemo(() => {
    const n = totalPages
    const p = page
    if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1)
    const list = new Set([1, n, p, p - 1, p + 1, p - 2, p + 2].filter((x) => x >= 1 && x <= n))
    return [...list].sort((a, b) => a - b)
  }, [totalPages, page])

  if (me === null) {
    return (
      <div className="sales-page">
        <div className="sales-loading">Загрузка…</div>
      </div>
    )
  }

  if (!me) {
    return (
      <div className="sales-page sales-page--center">
        <form className="sales-login" onSubmit={handleLogin}>
          <h1>Вход: заявки</h1>
          <p className="sales-login__hint">Страница /sales — только для администратора.</p>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {loginError ? <p className="sales-login__err">{loginError}</p> : null}
          <button type="submit">Войти</button>
        </form>
      </div>
    )
  }

  return (
    <div className="sales-page">
      <header className="sales-header">
        <div className="sales-header__inner">
          <div className="sales-header__brand">
            <span className="sales-header__title">MARTS CAMP</span>
            <span className="sales-header__sub">Заявки (таблица camp)</span>
          </div>
          <div className="sales-header__actions">
            <button type="button" className="sales-btn sales-btn--danger" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="sales-page__inset">
        <div className="sales-toolbar">
          <div className="sales-toolbar__dates">
            <label className="sales-field">
              <span>От</span>
              <input
                type="date"
                className="sales-date-input"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value)
                  bumpFilterReload()
                }}
              />
            </label>
            <label className="sales-field">
              <span>До</span>
              <input
                type="date"
                className="sales-date-input"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value)
                  bumpFilterReload()
                }}
              />
            </label>
          </div>
          <div className="sales-toolbar__buttons">
            <button type="button" className="sales-btn sales-btn--neutral" onClick={handleViewAllRecords}>
              Посмотреть все записи
            </button>
            <button type="button" className="sales-btn sales-btn--green" onClick={handleSeeNew}>
              См. новые заявки
            </button>
            <div className="sales-export-wrap" ref={exportMenuRef}>
              <button
                type="button"
                className="sales-btn sales-btn--muted"
                disabled={selectedIds.size === 0}
                onClick={() => {
                  if (selectedIds.size === 0) return
                  setExportMenuOpen((o) => !o)
                }}
                title={selectedIds.size === 0 ? 'Отметьте строки в таблице' : 'Формат выгрузки'}
              >
                Скачать выделенное {exportMenuOpen ? '▴' : '▾'}
              </button>
              {exportMenuOpen && selectedIds.size > 0 ? (
                <div className="sales-export-menu" role="menu">
                  <button type="button" className="sales-export-menu__item" role="menuitem" onClick={() => downloadSelectedAs('xlsx')}>
                    XLSX
                  </button>
                  <button type="button" className="sales-export-menu__item" role="menuitem" onClick={() => downloadSelectedAs('csv')}>
                    CSV
                  </button>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="sales-btn sales-btn--gold"
              onClick={downloadAllRecords}
              title="Полная выгрузка таблицы в Excel"
            >
              Скачать все записи
            </button>
          </div>
          {scopeAll ? (
            <p className="sales-toolbar__hint">Показаны все записи (фильтр по датам не действует).</p>
          ) : (
            <p className="sales-toolbar__hint">
              Список обновляется при смене дат «от / до». Диапазон: {dateFrom || '—'} … {dateTo || '—'}
            </p>
          )}
        </div>

        <main className="sales-main">
          {listError ? <p className="sales-banner-err">{listError}</p> : null}
          {loading ? (
            <p className="sales-muted">Загрузка таблицы…</p>
          ) : (
            <div className="sales-table-wrap">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th className="sales-th-select" scope="col">
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAllVisible}
                        aria-label="Выбрать все на странице"
                      />
                    </th>
                    <th scope="col">id</th>
                    <th scope="col">date</th>
                    <th scope="col">age</th>
                    <th scope="col">name</th>
                    <th scope="col">tel</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="sales-empty">
                        Нет записей
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r.id} className={selectedIds.has(r.id) ? 'sales-tr--selected' : undefined}>
                        <td className="sales-td-select">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(r.id)}
                            onChange={() => toggleSelectRow(r.id)}
                            aria-label={`Выбрать заявку ${r.id}`}
                          />
                        </td>
                        <td>{r.id}</td>
                        <td>{formatDate(r.date)}</td>
                        <td>{r.age}</td>
                        <td>{r.name}</td>
                        <td className="sales-td-tel">{r.tel}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <footer className="sales-footer">
          <div className="sales-pagination">
            <button
              type="button"
              className="sales-pagebtn"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Назад
            </button>
            <div className="sales-pages">
              {pages.map((num, idx) => {
                const prev = pages[idx - 1]
                const showGap = idx > 0 && prev && num - prev > 1
                return (
                  <span key={num} className="sales-page-wrap">
                    {showGap ? <span className="sales-gap">…</span> : null}
                    <button
                      type="button"
                      className={num === page ? 'sales-pagebtn sales-pagebtn--active' : 'sales-pagebtn'}
                      onClick={() => setPage(num)}
                    >
                      {num}
                    </button>
                  </span>
                )
              })}
            </div>
            <button
              type="button"
              className="sales-pagebtn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Вперёд
            </button>
          </div>
          <p className="sales-footer-meta">
            Страница {page} из {totalPages} · в выборке: {total} · отмечено строк: {selectedIds.size}
          </p>
        </footer>
      </div>
    </div>
  )
}
