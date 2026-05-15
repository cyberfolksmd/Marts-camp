import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'
import session from 'express-session'
import XLSX from 'xlsx'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = Number(process.env.PORT) || 3000

const pool = process.env.DATABASE_URL
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
    })
  : null

app.use(express.json({ limit: '64kb' }))

app.set('trust proxy', 1)

app.use(
  session({
    name: 'marts.sid',
    secret: process.env.SESSION_SECRET || 'dev-change-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
)

function requireAdmin(req, res, next) {
  if (req.session?.admin) return next()
  return res.status(401).json({ error: 'Unauthorized' })
}

function requirePool(req, res, next) {
  if (!pool) return res.status(503).json({ error: 'Database not configured (DATABASE_URL)' })
  return next()
}

function pgColumn(err) {
  return String(err?.column || '').trim()
}

/** Идентификатор PostgreSQL в кавычках (учёт пробелов и регистра в имени колонки). */
function quoteIdent(name) {
  return `"${String(name).replace(/"/g, '""')}"`
}

function normalizeColName(name) {
  return String(name || '').trim().toLowerCase()
}

let campColsCache = null
let campColsCacheAt = 0
const CAMP_COLS_TTL_MS = 60_000

/**
 * Реальные имена колонок public.camp (как в БД), сопоставленные по нормализованному имени:
 * id, date, age, name, tel, done — чтобы работало при "id ", "Date" и т.п.
 */
async function loadCampColumns(pool) {
  const { rows } = await pool.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'camp'
     ORDER BY ordinal_position`
  )
  const map = {}
  for (const { column_name: c } of rows) {
    const n = normalizeColName(c)
    if (['id', 'date', 'age', 'name', 'tel', 'done'].includes(n) && map[n] == null) {
      map[n] = c
    }
  }
  return map
}

async function getCampColumns(pool) {
  const now = Date.now()
  if (campColsCache && now - campColsCacheAt < CAMP_COLS_TTL_MS) return campColsCache
  campColsCache = await loadCampColumns(pool)
  campColsCacheAt = now
  return campColsCache
}

function Q(m) {
  const out = {}
  for (const k of ['id', 'date', 'age', 'name', 'tel', 'done']) {
    if (m[k]) out[k] = quoteIdent(m[k])
  }
  return out
}

/**
 * Вставка заявки: id через DEFAULT (если есть в БД), date — CURRENT_DATE при наличии колонки.
 * Если NOT NULL на id без default — транзакция и MAX(id)+1.
 * Имена колонок из information_schema + quote_ident (колонка "id " и т.д.).
 */
function buildCampInsert(m, q, age, name, tel, nid) {
  const cols = [q.id]
  const vals = []
  const params = []
  let pi = 0
  const ph = () => {
    pi += 1
    return `$${pi}`
  }

  if (nid == null) vals.push('DEFAULT')
  else {
    params.push(nid)
    vals.push(ph())
  }
  if (m.date) {
    cols.push(q.date)
    vals.push('CURRENT_DATE')
  }
  cols.push(q.age, q.name, q.tel)
  for (const v of [age, name, tel]) {
    params.push(v)
    vals.push(ph())
  }
  if (m.done) {
    cols.push(q.done)
    vals.push('FALSE')
  }
  return {
    text: `INSERT INTO camp (${cols.join(', ')}) VALUES (${vals.join(', ')})`,
    params,
  }
}

async function insertCampApplication(pool, age, name, tel) {
  const m = await getCampColumns(pool)
  if (!m.id || !m.age || !m.name || !m.tel) {
    throw new Error(
      `public.camp: нужны колонки id, age, name, tel. Обнаружено: ${Object.keys(m).join(', ') || '(пусто)'}`
    )
  }
  const q = Q(m)

  const first = buildCampInsert(m, q, age, name, tel, null)
  try {
    await pool.query(first.text, first.params)
    return
  } catch (e1) {
    if (e1?.code !== '23502' || pgColumn(e1) !== 'id') throw e1
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('LOCK TABLE camp IN SHARE ROW EXCLUSIVE MODE')
    const maxSql = `SELECT COALESCE(MAX(${q.id}), 0) + 1 AS nid FROM camp`
    const { rows } = await client.query(maxSql)
    const nid = rows[0].nid
    const ins = buildCampInsert(m, q, age, name, tel, nid)
    await client.query(ins.text, ins.params)
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

app.get('/api/admin/me', (req, res) => {
  res.json({ admin: Boolean(req.session?.admin) })
})

app.post('/api/admin/login', (req, res) => {
  const password = req.body?.password
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'ADMIN_PASSWORD is not set' })
  }
  if (typeof password !== 'string' || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' })
  }
  req.session.admin = true
  return res.json({ ok: true })
})

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('session destroy', err)
    res.clearCookie('marts.sid', { path: '/' })
    res.json({ ok: true })
  })
})

app.post('/api/send', requirePool, async (req, res) => {
  const name = String(req.body?.name ?? '')
  const tel = String(req.body?.phone ?? req.body?.tel ?? '')
  const age = String(req.body?.age ?? '')

  if (!name.trim() || !tel.trim()) {
    return res.status(400).json({ success: false, error: 'missing fields' })
  }

  try {
    await insertCampApplication(pool, age, name, tel)
  } catch (err) {
    console.error('camp insert', err?.code, err?.message, err)
    return res.status(500).json({ success: false, error: 'db' })
  }

  if (process.env.TG_BOT_TOKEN && process.env.TG_CHAT_ID) {
    const text = `
🔥 Новая заявка MARTS CAMP

👤 Имя: ${name}
📱 Телефон: ${tel}
🎯 Возраст: ${age}
`
    try {
      await axios.post(`https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`, {
        chat_id: process.env.TG_CHAT_ID,
        text,
      })
    } catch (err) {
      console.error('telegram', err?.message || err)
    }
  }

  res.json({ success: true })
})

async function campSelectProjection(pool) {
  const m = await getCampColumns(pool)
  if (!m.id || !m.age || !m.name || !m.tel) {
    throw new Error(`public.camp: нужны id, age, name, tel. Есть: ${Object.keys(m).join(', ')}`)
  }
  const q = Q(m)
  const selectList = [
    `${q.id} AS id`,
    m.date ? `${q.date} AS date` : 'NULL::date AS date',
    `${q.age} AS age`,
    `${q.name} AS name`,
    `${q.tel} AS tel`,
    m.done ? `${q.done} AS done` : 'FALSE::boolean AS done',
  ].join(', ')
  return { selectList, orderBy: q.id, m, q, hasDone: Boolean(m.done) }
}

function parseISODate(value) {
  if (value == null || typeof value !== 'string') return null
  const t = value.trim().slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null
  return t
}

/** Фильтр по колонке date (scopeAll — без фильтра по датам). */
function buildCampDateFilter(m, q, dateFrom, dateTo, scopeAll) {
  if (scopeAll || !m.date) return { where: '', params: [] }
  const params = []
  const parts = []
  if (dateFrom) {
    params.push(dateFrom)
    parts.push(`${q.date}::date >= $${params.length}::date`)
  }
  if (dateTo) {
    params.push(dateTo)
    parts.push(`${q.date}::date <= $${params.length}::date`)
  }
  if (parts.length === 0) return { where: '', params: [] }
  return { where: ` WHERE ${parts.join(' AND ')} `, params }
}

app.get('/api/sales/camp', requireAdmin, requirePool, async (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1)
  const pageSizeRaw = parseInt(String(req.query.pageSize || '20'), 10) || 20
  const pageSize = Math.min(100, Math.max(1, pageSizeRaw))
  const offset = (page - 1) * pageSize

  const scopeAll = String(req.query.scope || '') === 'all'
  const dateFrom = parseISODate(req.query.dateFrom)
  const dateTo = parseISODate(req.query.dateTo)

  try {
    const { selectList, orderBy, m, q } = await campSelectProjection(pool)
    const { where, params: wParams } = buildCampDateFilter(m, q, dateFrom, dateTo, scopeAll)

    const countR = await pool.query(`SELECT COUNT(*)::int AS c FROM camp${where}`, wParams)
    const total = countR.rows[0]?.c ?? 0

    const p1 = wParams.length + 1
    const p2 = wParams.length + 2
    const dataR = await pool.query(
      `SELECT ${selectList} FROM camp${where} ORDER BY ${orderBy} DESC LIMIT $${p1} OFFSET $${p2}`,
      [...wParams, pageSize, offset]
    )

    return res.json({
      page,
      pageSize,
      total,
      scopeAll,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      rows: dataR.rows.map((row) => ({
        ...row,
        date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date,
      })),
    })
  } catch (err) {
    console.error('sales list', err)
    return res.status(500).json({ error: 'db' })
  }
})

app.patch('/api/sales/camp/:id', requireAdmin, requirePool, async (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'bad id' })
  const done = Boolean(req.body?.done)

  try {
    const m = await getCampColumns(pool)
    if (!m.done) return res.status(400).json({ error: 'В таблице camp нет колонки done' })
    const q = Q(m)
    const r = await pool.query(
      `UPDATE camp SET ${q.done} = $1 WHERE ${q.id} = $2 RETURNING ${q.id} AS id, ${q.done} AS done`,
      [done, id]
    )
    if (r.rowCount === 0) return res.status(404).json({ error: 'not found' })
    return res.json(r.rows[0])
  } catch (err) {
    console.error('sales patch', err)
    return res.status(500).json({ error: 'db' })
  }
})

function rowsToExportObjects(rows) {
  return rows.map((row) => ({
    id: row.id,
    date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date,
    age: row.age,
    name: row.name,
    tel: row.tel,
    done: row.done,
  }))
}

function csvEscape(value) {
  const s = value == null ? '' : String(value)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function buildExportWhere(req, m, q) {
  const exportAll = String(req.query.all || '') === '1' || String(req.query.scope || '') === 'all'
  if (exportAll) return buildCampDateFilter(m, q, null, null, true)
  const dateFrom = parseISODate(req.query.dateFrom)
  const dateTo = parseISODate(req.query.dateTo)
  return buildCampDateFilter(m, q, dateFrom, dateTo, false)
}

app.get('/api/sales/export.csv', requireAdmin, requirePool, async (req, res) => {
  try {
    const { selectList, orderBy, m, q } = await campSelectProjection(pool)
    const { where, params: wParams } = buildExportWhere(req, m, q)
    const r = await pool.query(
      `SELECT ${selectList} FROM camp${where} ORDER BY ${orderBy} DESC`,
      wParams
    )
    const list = rowsToExportObjects(r.rows)
    const header = ['id', 'date', 'age', 'name', 'tel', 'done']
    const lines = [
      header.join(','),
      ...list.map((row) => header.map((h) => csvEscape(row[h])).join(',')),
    ]
    const csv = `\uFEFF${lines.join('\n')}`
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="camp.csv"')
    return res.send(csv)
  } catch (err) {
    console.error('export csv', err)
    return res.status(500).end()
  }
})

app.get('/api/sales/export.xlsx', requireAdmin, requirePool, async (req, res) => {
  try {
    const { selectList, orderBy, m, q } = await campSelectProjection(pool)
    const { where, params: wParams } = buildExportWhere(req, m, q)
    const r = await pool.query(
      `SELECT ${selectList} FROM camp${where} ORDER BY ${orderBy} DESC`,
      wParams
    )
    const list = rowsToExportObjects(r.rows)
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(
      list.length ? list : [{ id: '', date: '', age: '', name: '', tel: '', done: '' }]
    )
    XLSX.utils.book_append_sheet(wb, ws, 'camp')
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader('Content-Disposition', 'attachment; filename="camp.xlsx"')
    return res.send(Buffer.from(buf))
  } catch (err) {
    console.error('export xlsx', err)
    return res.status(500).end()
  }
})

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

if (pool) {
  pool.on('error', (err) => {
    console.error('pg pool', err)
  })
}

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT}`)
  if (!pool) console.warn('DATABASE_URL is not set — заявки в БД и /sales не будут работать')
  if (!process.env.ADMIN_PASSWORD) console.warn('ADMIN_PASSWORD is not set — вход в /sales недоступен')
})
