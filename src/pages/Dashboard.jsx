import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import '../styles/global.css'
import '../styles/buttons.css'
import '../styles/gamification.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { lang, m, t, toggleLang } = useLanguage()
  const g = m.gamification

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkUser = useCallback(async () => {
    try {
      const res = await fetch('/api/gamification/me')
      const data = await res.json()
      if (!data.user) {
        navigate('/login', { replace: true })
      } else {
        setUser(data.user)
      }
    } catch {
      navigate('/login', { replace: true })
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  const handleLogout = async () => {
    try {
      await fetch('/api/gamification/logout', { method: 'POST' })
      navigate('/login', { replace: true })
    } catch {
      /* ignore */
    }
  }

  if (loading) {
    return (
      <div className="g-page">
        <div className="g-container" style={{ textAlign: 'center', marginTop: '5rem' }}>
          <h2>Загрузка... / Se încarcă...</h2>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="g-page">
      {/* Шапка дашборда */}
      <header className="g-header">
        <div className="g-container g-header-inner">
          <div className="g-header-brand">
            <a href="/" className="g-header-logo">MARTS CAMP</a>
            <span className="g-header-badge">{g.roles[user.role]}</span>
          </div>

          <div className="g-header-user">
            <span className="g-header-name">{user.name}</span>
            <button type="button" className="btn-lang" onClick={toggleLang}>
              {t('langSwitch')}
            </button>
            <button type="button" className="g-header-logout" onClick={handleLogout}>
              Выйти / Logout
            </button>
          </div>
        </div>
      </header>

      {/* Основной контент в зависимости от роли */}
      <div className="g-container" style={{ flex: 1 }}>
        {user.role === 'child' && <ChildDashboard user={user} g={g} lang={lang} />}
        {user.role === 'parent' && <ParentDashboard user={user} g={g} lang={lang} />}
        {user.role === 'counselor' && <CounselorDashboard user={user} g={g} lang={lang} />}
        {user.role === 'admin' && <AdminDashboard user={user} g={g} lang={lang} />}
      </div>
    </div>
  )
}

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ДЛЯ МАГАЗИНА (ИКОНКИ) ---
function getProductEmoji(title) {
  const t = title.toLowerCase()
  if (t.includes('браслет') || t.includes('brătară') || t.includes('bratara')) return '🎗️'
  if (t.includes('бутылка') || t.includes('sticlă') || t.includes('sticla')) return '🥤'
  if (t.includes('кепка') || t.includes('șapcă') || t.includes('sapca')) return '🧢'
  if (t.includes('футболка') || t.includes('tricou')) return '👕'
  if (t.includes('карта') || t.includes('card')) return '💳'
  return '🎁'
}

// ==========================================
// 1. ДАШБОРД РЕБЕНКА (CHILD)
// ==========================================
function ChildDashboard({ user, g, lang }) {
  const [profile, setProfile] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [shopItems, setShopItems] = useState([])
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const pRes = await fetch('/api/gamification/child/profile')
      const pData = await pRes.json()
      setProfile(pData)

      const tRes = await fetch('/api/gamification/child/transactions')
      const tData = await tRes.json()
      setTransactions(tData)

      const sRes = await fetch('/api/gamification/child/shop')
      const sData = await sRes.json()
      setShopItems(sData)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleReserve = async (itemId) => {
    setMessage('')
    setIsError(false)
    try {
      const res = await fetch('/api/gamification/child/shop/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка бронирования')
      }
      setMessage(g.child.successReserve)
      loadData()
    } catch (err) {
      setIsError(true)
      setMessage(err.message === 'Недостаточно MARTS коинов для покупки' ? g.child.noCoins : err.message)
    }
  }

  if (!profile) return <div>Загрузка профиля...</div>

  return (
    <div className="g-child-grid">
      {/* Левая колонка: баланс и возрастная группа */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="g-card" style={{ textAlign: 'center' }}>
          <h2 className="g-card-title">{g.child.balance}</h2>
          <div className="g-coin-circle-wrap">
            <div className="g-coin-circle">
              <img src="/assets/coin.webp" alt="coin" style={{ width: '40px', height: '40px', marginBottom: '0.25rem', objectFit: 'contain' }} />
              <span className="g-coin-val" style={{ fontSize: '2.5rem' }}>{profile.coins}</span>
              <span className="g-coin-lbl">MARTS</span>
            </div>
          </div>
          <div className="g-child-age-group">
            {g.child.ageGroup}: {profile.age_group === '5-8' ? 'MARTS SCOUTS (5-8)' : 'MARTS RANGERS (9-13)'}
          </div>
        </div>

        {/* Последние транзакции ребенка */}
        <div className="g-card">
          <h2 className="g-card-title">{g.child.history}</h2>
          <div className="g-tx-list">
            {transactions.length === 0 ? (
              <p className="g-tx-desc">Транзакций пока нет</p>
            ) : (
              transactions.map((tx) => (
                <div className="g-tx-item" key={tx.id}>
                  <div className="g-tx-info">
                    <span className="g-tx-title">
                      {lang === 'ro' ? tx.title_ro || tx.title_ru : tx.title_ru}
                    </span>
                    {tx.description && <span className="g-tx-desc">{tx.description}</span>}
                    <span className="g-tx-meta">
                      {tx.counselor_name ? `${tx.counselor_name} · ` : ''}
                      {new Date(tx.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`g-tx-amount ${tx.amount > 0 ? 'g-tx-amount--plus' : 'g-tx-amount--minus'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    <img src="/assets/coin.webp" alt="coin" style={{ width: '1rem', height: '1rem', objectFit: 'contain' }} />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Правая колонка: магазин */}
      <div className="g-card">
        <h2 className="g-card-title">{g.child.shop}</h2>

        {message && (
          <div 
            className="g-login-error" 
            style={{ 
              marginBottom: '1rem', 
              background: isError ? 'rgba(196,45,66,0.15)' : 'rgba(74,222,128,0.15)',
              borderColor: isError ? 'rgba(196,45,66,0.5)' : 'rgba(74,222,128,0.5)',
              color: isError ? '#ff8b9a' : '#4ade80'
            }}
          >
            {message}
          </div>
        )}

        <div className="g-shop-grid">
          {shopItems.map((item) => {
            const isOutOfStock = item.stock <= 0
            const isReserved = item.reserved_count > 0
            const title = lang === 'ro' ? item.title_ro : item.title_ru

            return (
              <div className="g-shop-card" key={item.id}>
                <div className="g-shop-img">{getProductEmoji(title)}</div>
                <div className="g-shop-name" title={title}>{title}</div>
                
                <div className="g-shop-footer">
                  <span className="g-shop-price" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    {item.price}
                    <img src="/assets/coin.webp" alt="coin" style={{ width: '1rem', height: '1rem', objectFit: 'contain' }} />
                  </span>
                  {isOutOfStock ? (
                    <span className="g-shop-out">{g.child.noStock}</span>
                  ) : isReserved ? (
                    <span className="g-shop-reserved-badge">{g.child.reserved}</span>
                  ) : (
                    <button
                      type="button"
                      className="btn-primary g-shop-btn"
                      disabled={profile.coins < item.price}
                      onClick={() => handleReserve(item.id)}
                    >
                      {g.child.reserve}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 2. ДАШБОРД РОДИТЕЛЯ (PARENT)
// ==========================================
function ParentDashboard({ user, g, lang }) {
  const [children, setChildren] = useState([])

  useEffect(() => {
    fetch('/api/gamification/parent/children')
      .then((res) => res.json())
      .then((data) => setChildren(data))
      .catch((err) => console.error(err))
  }, [])

  if (children.length === 0) {
    return (
      <div className="g-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <p>{g.parent.noChildren}</p>
      </div>
    )
  }

  return (
    <div className="g-parent-child-section">
      <h1 className="g-card-title" style={{ borderBottom: 'none', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        {g.parent.title}
      </h1>

      {children.map((child) => (
        <div className="g-parent-child-card" key={child.profile_id}>
          <div className="g-parent-child-header">
            <span className="g-parent-child-name">{child.child_name}</span>
            <div className="g-child-age-group" style={{ margin: 0 }}>
              {g.child.balance}: <strong style={{ color: 'var(--gold)', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', verticalAlign: 'middle' }}>
                <img src="/assets/coin.webp" alt="coin" style={{ width: '1.2rem', height: '1.2rem', objectFit: 'contain' }} />
                {child.coins} MARTS
              </strong> (Группа: {child.age_group})
            </div>
          </div>

          <div className="g-parent-child-grid">
            {/* Транзакции */}
            <div>
              <h3 className="g-card-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                {g.parent.childHistory}
              </h3>
              <div className="g-tx-list" style={{ maxHeight: '280px' }}>
                {child.transactions.length === 0 ? (
                  <p className="g-tx-desc">Транзакций пока нет</p>
                ) : (
                  child.transactions.map((tx) => (
                    <div className="g-tx-item" key={tx.id}>
                      <div className="g-tx-info">
                        <span className="g-tx-title">
                          {lang === 'ro' ? tx.title_ro || tx.title_ru : tx.title_ru}
                        </span>
                        {tx.description && <span className="g-tx-desc">{tx.description}</span>}
                        <span className="g-tx-meta">
                          {tx.counselor_name ? `${tx.counselor_name} · ` : ''}
                          {new Date(tx.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`g-tx-amount ${tx.amount > 0 ? 'g-tx-amount--plus' : 'g-tx-amount--minus'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        <img src="/assets/coin.webp" alt="coin" style={{ width: '1rem', height: '1rem', objectFit: 'contain' }} />
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Заказы */}
            <div>
              <h3 className="g-card-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                {g.parent.childOrders}
              </h3>
              <div className="g-table-wrap" style={{ background: 'rgba(10, 22, 16, 0.25)' }}>
                <table className="g-table" style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th>Название / Nume</th>
                      <th>Цена / Preț</th>
                      <th>Статус / Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {child.orders.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', color: 'rgba(250, 246, 239, 0.4)' }}>
                          Заказов пока нет
                        </td>
                      </tr>
                    ) : (
                      child.orders.map((o) => (
                        <tr key={o.id}>
                          <td>{lang === 'ro' ? o.title_ro : o.title_ru}</td>
                          <td style={{ color: 'var(--gold)', fontWeight: '700' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                              {o.price} <img src="/assets/coin.webp" alt="coin" style={{ width: '0.9rem', height: '0.9rem', objectFit: 'contain' }} />
                            </span>
                          </td>
                          <td>
                            <span 
                              className="g-header-badge" 
                              style={{ 
                                background: o.status === 'claimed' ? '#4ade80' : o.status === 'cancelled' ? 'var(--ribbon)' : 'var(--gold-deep)',
                                color: o.status === 'claimed' ? 'var(--ink)' : 'var(--cream)',
                                fontSize: '0.6rem'
                              }}
                            >
                              {o.status === 'claimed' ? g.admin.orders.claimed : o.status === 'cancelled' ? g.admin.orders.cancelled : g.admin.orders.pending}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ==========================================
// 3. ДАШБОРД ВОСПИТАТЕЛЯ (COUNSELOR)
// ==========================================
function CounselorDashboard({ user, g, lang }) {
  const [kids, setKids] = useState([])
  const [criteria, setCriteria] = useState([])
  const [selectedKids, setSelectedKids] = useState(new Set())
  const [selectedCriterion, setSelectedCriterion] = useState(null)
  const [customAmount, setCustomAmount] = useState('')
  const [description, setDescription] = useState('')
  const [filterGroup, setFilterGroup] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const kRes = await fetch('/api/gamification/counselor/children')
      const kData = await kRes.json()
      setKids(kData)

      const cRes = await fetch('/api/gamification/counselor/criteria')
      const cData = await cRes.json()
      setCriteria(cData)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const toggleKid = (profileId) => {
    setSelectedKids((prev) => {
      const next = new Set(prev)
      if (next.has(profileId)) next.delete(profileId)
      else next.add(profileId)
      return next
    })
  }

  const handleSelectAll = () => {
    const visibleKids = filteredKids.map((k) => k.profile_id)
    const allSelected = visibleKids.every((id) => selectedKids.has(id))
    
    setSelectedKids((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        visibleKids.forEach((id) => next.delete(id))
      } else {
        visibleKids.forEach((id) => next.add(id))
      }
      return next
    })
  }

  const handleAward = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsError(false)

    if (selectedKids.size === 0) {
      setIsError(true)
      setMessage(g.counselor.selectChild)
      return
    }

    if (!selectedCriterion) {
      setIsError(true)
      setMessage(g.counselor.selectCriterion)
      return
    }

    try {
      const res = await fetch('/api/gamification/counselor/award', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childProfileIds: Array.from(selectedKids),
          criterionId: selectedCriterion,
          customAmount: customAmount !== '' ? Number(customAmount) : undefined,
          description: description
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Server error')
      }

      setMessage(g.counselor.success)
      setSelectedKids(new Set())
      setSelectedCriterion(null)
      setCustomAmount('')
      setDescription('')
      loadData()
    } catch (err) {
      setIsError(true)
      setMessage(err.message)
    }
  }

  const filteredKids = kids.filter((k) => {
    const matchesGroup = filterGroup === 'all' || k.age_group === filterGroup
    const matchesSearch = k.child_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGroup && matchesSearch
  })

  return (
    <div className="g-counselor-grid">
      {/* Левая панель: Сетка детей */}
      <div className="g-card">
        <div className="g-kids-header">
          <h2 className="g-card-title" style={{ border: 'none', margin: 0, padding: 0 }}>
            Дети / Copii ({filteredKids.length})
          </h2>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="g-input"
              placeholder="Поиск..."
              style={{ width: '160px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="g-select"
              style={{ width: '150px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
            >
              <option value="all">{g.counselor.allGroups}</option>
              <option value="5-8">5–8 (Scouts)</option>
              <option value="9-13">9–13 (Rangers)</option>
            </select>

            <button type="button" className="g-action-btn g-action-btn--primary" onClick={handleSelectAll}>
              Выбрать всех / Toți
            </button>
          </div>
        </div>

        <div className="g-kids-grid">
          {filteredKids.map((kid) => {
            const isSelected = selectedKids.has(kid.profile_id)
            return (
              <div 
                className={`g-kid-card ${isSelected ? 'is-selected' : ''}`}
                key={kid.profile_id}
                onClick={() => toggleKid(kid.profile_id)}
              >
                <div className="g-kid-check">✓</div>
                <div className="g-kid-avatar">{kid.child_name.slice(0, 1)}</div>
                <div className="g-kid-name">{kid.child_name}</div>
                <div className="g-kid-coins" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'center' }}>
                  <img src="/assets/coin.webp" alt="coin" style={{ width: '1rem', height: '1rem', objectFit: 'contain' }} />
                  {kid.coins}
                </div>
                <div className={`g-kid-group ${kid.age_group === '5-8' ? 'g-kid-group--scouts' : 'g-kid-group--rangers'}`}>
                  {kid.age_group === '5-8' ? 'Scouts' : 'Rangers'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Правая панель: Начисление коинов */}
      <div className="g-card">
        <h2 className="g-card-title">{g.counselor.awardTitle}</h2>

        {message && (
          <div 
            className="g-login-error" 
            style={{ 
              marginBottom: '1rem', 
              background: isError ? 'rgba(196,45,66,0.15)' : 'rgba(74,222,128,0.15)',
              borderColor: isError ? 'rgba(196,45,66,0.5)' : 'rgba(74,222,128,0.5)',
              color: isError ? '#ff8b9a' : '#4ade80'
            }}
          >
            {message}
          </div>
        )}

        <form className="g-award-form" onSubmit={handleAward}>
          <div className="g-selected-count">
            Выбрано детей / Copii selectați: <strong>{selectedKids.size}</strong>
          </div>

          <div>
            <label>{g.counselor.selectCriterion}</label>
            <div className="g-award-list">
              {criteria.map((crit) => (
                <div 
                  className={`g-award-option ${selectedCriterion === crit.id ? 'is-selected' : ''}`}
                  key={crit.id}
                  onClick={() => setSelectedCriterion(crit.id)}
                >
                  <span>{lang === 'ro' ? crit.title_ro : crit.title_ru}</span>
                  <span className="g-award-pts" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    +{crit.default_coins}
                    <img src="/assets/coin.webp" alt="coin" style={{ width: '0.9rem', height: '0.9rem', objectFit: 'contain' }} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="custom_amount">Другое количество монет (опционально)</label>
            <input
              id="custom_amount"
              type="number"
              className="g-input"
              placeholder="Напр. 15"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="award_desc">{g.counselor.comment}</label>
            <textarea
              id="award_desc"
              className="g-input"
              style={{ minHeight: '60px', fontFamily: 'inherit' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="..."
            />
          </div>

          <button type="submit" className="btn-primary g-login-btn">
            {g.counselor.awardBtn}
          </button>
        </form>
      </div>
    </div>
  )
}

// ==========================================
// 4. ПАНЕЛЬ СУПЕР-АДМИНИСТРАТОРА (ADMIN)
// ==========================================
function AdminDashboard({ user, g, lang }) {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div>
      {/* Переключение вкладок */}
      <div className="g-tabs">
        <button 
          className={`g-tab-btn ${activeTab === 'users' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          {g.admin.tabs.users}
        </button>
        <button 
          className={`g-tab-btn ${activeTab === 'store' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('store')}
        >
          {g.admin.tabs.store}
        </button>
        <button 
          className={`g-tab-btn ${activeTab === 'orders' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          {g.admin.tabs.orders}
        </button>
        <button 
          className={`g-tab-btn ${activeTab === 'seller' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('seller')}
        >
          {g.admin.tabs.seller}
        </button>
        <button 
          className={`g-tab-btn ${activeTab === 'ledger' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('ledger')}
        >
          {g.admin.tabs.ledger}
        </button>
      </div>

      {/* Рендеринг вкладки */}
      <div className={activeTab === 'seller' ? '' : 'g-card'}>
        {activeTab === 'users' && <AdminUsersTab g={g} />}
        {activeTab === 'store' && <AdminStoreTab g={g} />}
        {activeTab === 'orders' && <AdminOrdersTab g={g} />}
        {activeTab === 'seller' && <AdminSellerTab g={g} lang={lang} />}
        {activeTab === 'ledger' && <AdminLedgerTab g={g} lang={lang} />}
      </div>
    </div>
  )
}

// --- АДМИН: ВКЛАДКА ПОЛЬЗОВАТЕЛИ ---
function AdminUsersTab({ g }) {
  const [users, setUsers] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)

  // Поля формы
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('child')
  const [parentId, setParentId] = useState('')
  const [ageGroup, setAgeGroup] = useState('5-8')

  const [error, setError] = useState('')

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/gamification/admin/users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault()
    setError('')

    const payload = {
      username,
      name,
      role,
      password: password || undefined,
      parentId: parentId !== '' ? Number(parentId) : undefined,
      ageGroup: role === 'child' ? ageGroup : undefined
    }

    try {
      let res
      if (editingUserId) {
        res = await fetch(`/api/gamification/admin/users/${editingUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch('/api/gamification/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, password: password || '1234' }) // дефолтный если не задан
        })
      }

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Server error')
      }

      // Сброс формы
      setUsername('')
      setPassword('')
      setName('')
      setRole('child')
      setParentId('')
      setAgeGroup('5-8')
      setFormOpen(false)
      setEditingUserId(null)
      loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (user) => {
    setEditingUserId(user.id)
    setUsername(user.username)
    setPassword('')
    setName(user.name)
    setRole(user.role)
    setParentId(user.parent_id || '')
    setAgeGroup(user.age_group || '5-8')
    setError('')
    setFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return
    try {
      const res = await fetch(`/api/gamification/admin/users/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error')
      }
      loadUsers()
    } catch (err) {
      alert(err.message)
    }
  }

  const parents = users.filter((u) => u.role === 'parent')

  return (
    <div>
      <div className="g-admin-card-header">
        <h2 className="g-card-title">{g.admin.tabs.users}</h2>
        {!formOpen && (
          <button 
            type="button" 
            className="g-action-btn g-action-btn--primary" 
            style={{ padding: '0.4rem 1rem' }}
            onClick={() => {
              setEditingUserId(null)
              setUsername('')
              setPassword('')
              setName('')
              setRole('child')
              setParentId('')
              setAgeGroup('5-8')
              setError('')
              setFormOpen(true)
            }}
          >
            + {g.admin.users.addBtn}
          </button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleCreateOrUpdate} className="g-card" style={{ background: 'rgba(10,22,16,0.3)', marginBottom: '2rem', borderStyle: 'dashed' }}>
          <h3 className="g-card-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            {editingUserId ? 'Редактировать пользователя' : 'Создать пользователя'}
          </h3>

          {error && <div className="g-login-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          <div className="g-admin-form-row">
            <div>
              <label htmlFor="usr">{g.admin.users.username}</label>
              <input id="usr" className="g-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="pass">Пароль (PIN-код)</label>
              <input id="pass" className="g-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={editingUserId ? '(Не менять)' : 'Напр. 1111'} />
            </div>
          </div>

          <div className="g-admin-form-row">
            <div>
              <label htmlFor="nm">{g.admin.users.name}</label>
              <input id="nm" className="g-input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="rl">{g.admin.users.role}</label>
              <select id="rl" className="g-select" value={role} onChange={(e) => setRole(e.target.value)} disabled={Boolean(editingUserId)}>
                <option value="child">{g.roles.child}</option>
                <option value="parent">{g.roles.parent}</option>
                <option value="counselor">{g.roles.counselor}</option>
                <option value="admin">{g.roles.admin}</option>
              </select>
            </div>
          </div>

          {role === 'child' && (
            <div className="g-admin-form-row">
              <div>
                <label htmlFor="prnt">{g.admin.users.parent}</label>
                <select id="prnt" className="g-select" value={parentId} onChange={(e) => setParentId(e.target.value)}>
                  <option value="">(Выбрать родителя)</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ag">{g.admin.users.group}</label>
                <select id="ag" className="g-select" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                  <option value="5-8">5–8 (Scouts)</option>
                  <option value="9-13">9–13 (Rangers)</option>
                </select>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="submit" className="g-action-btn g-action-btn--success" style={{ padding: '0.5rem 1.25rem' }}>
              {g.admin.users.save}
            </button>
            <button type="button" className="g-action-btn g-action-btn--danger" style={{ padding: '0.5rem 1.25rem' }} onClick={() => setFormOpen(false)}>
              {g.admin.users.cancel}
            </button>
          </div>
        </form>
      )}

      <div className="g-table-wrap">
        <table className="g-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{g.admin.users.username}</th>
              <th>{g.admin.users.role}</th>
              <th>{g.admin.users.name}</th>
              <th>Баланс / Группа</th>
              <th>Родитель</th>
              <th>{g.admin.users.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>
                  <span className="g-header-badge" style={{ background: u.role === 'admin' ? 'var(--ribbon)' : u.role === 'counselor' ? 'var(--wood-light)' : 'rgba(250,246,239,0.15)' }}>
                    {g.roles[u.role]}
                  </span>
                </td>
                <td>{u.name}</td>
                <td>
                  {u.role === 'child' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <strong>{u.coins || 0}</strong>
                      <img src="/assets/coin.webp" alt="coin" style={{ width: '0.9rem', height: '0.9rem', objectFit: 'contain' }} />
                      / {u.age_group}
                    </span>
                  ) : '—'}
                </td>
                <td>{u.parent_name || '—'}</td>
                <td>
                  <button type="button" className="g-action-btn g-action-btn--primary" onClick={() => handleEdit(u)}>
                    Ред.
                  </button>
                  <button type="button" className="g-action-btn g-action-btn--danger" onClick={() => handleDelete(u.id)}>
                    Удал.
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- АДМИН: ВКЛАДКА МАГАЗИН ---
function AdminStoreTab({ g }) {
  const [items, setItems] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)

  const [titleRu, setTitleRu] = useState('')
  const [titleRo, setTitleRo] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [error, setError] = useState('')

  const loadItems = useCallback(async () => {
    try {
      const res = await fetch('/api/gamification/admin/store')
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault()
    setError('')

    const payload = {
      title_ru: titleRu,
      title_ro: titleRo,
      price: Number(price),
      stock: Number(stock)
    }

    try {
      let res
      if (editingItemId) {
        res = await fetch(`/api/gamification/admin/store/${editingItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch('/api/gamification/admin/store', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Server error')
      }

      setTitleRu('')
      setTitleRo('')
      setPrice('')
      setStock('')
      setFormOpen(false)
      setEditingItemId(null)
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (item) => {
    setEditingItemId(item.id)
    setTitleRu(item.title_ru)
    setTitleRo(item.title_ro)
    setPrice(item.price)
    setStock(item.stock)
    setError('')
    setFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return
    try {
      const res = await fetch(`/api/gamification/admin/store/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error')
      loadItems()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div className="g-admin-card-header">
        <h2 className="g-card-title">{g.admin.tabs.store}</h2>
        {!formOpen && (
          <button 
            type="button" 
            className="g-action-btn g-action-btn--primary"
            style={{ padding: '0.4rem 1rem' }}
            onClick={() => {
              setEditingItemId(null)
              setTitleRu('')
              setTitleRo('')
              setPrice('')
              setStock('')
              setError('')
              setFormOpen(true)
            }}
          >
            + {g.admin.store.addBtn}
          </button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleCreateOrUpdate} className="g-card" style={{ background: 'rgba(10,22,16,0.3)', marginBottom: '2rem', borderStyle: 'dashed' }}>
          <h3 className="g-card-title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            {editingItemId ? 'Редактировать товар' : 'Добавить товар'}
          </h3>

          {error && <div className="g-login-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          <div className="g-admin-form-row">
            <div>
              <label htmlFor="t_ru">Название (RU)</label>
              <input id="t_ru" className="g-input" type="text" value={titleRu} onChange={(e) => setTitleRu(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="t_ro">Название (RO)</label>
              <input id="t_ro" className="g-input" type="text" value={titleRo} onChange={(e) => setTitleRo(e.target.value)} required />
            </div>
          </div>

          <div className="g-admin-form-row">
            <div>
              <label htmlFor="prc">{g.admin.store.price}</label>
              <input id="prc" className="g-input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="stck">{g.admin.store.stock}</label>
              <input id="stck" className="g-input" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="submit" className="g-action-btn g-action-btn--success" style={{ padding: '0.5rem 1.25rem' }}>
              {g.admin.users.save}
            </button>
            <button type="button" className="g-action-btn g-action-btn--danger" style={{ padding: '0.5rem 1.25rem' }} onClick={() => setFormOpen(false)}>
              {g.admin.users.cancel}
            </button>
          </div>
        </form>
      )}

      <div className="g-table-wrap">
        <table className="g-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название (RU)</th>
              <th>Название (RO)</th>
              <th>Цена / Preț</th>
              <th>Наличие / Stoc</th>
              <th>{g.admin.users.actions}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title_ru}</td>
                <td>{item.title_ro}</td>
                <td style={{ color: 'var(--gold)', fontWeight: '700' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    {item.price} <img src="/assets/coin.webp" alt="coin" style={{ width: '0.9rem', height: '0.9rem', objectFit: 'contain' }} />
                  </span>
                </td>
                <td>{item.stock}</td>
                <td>
                  <button type="button" className="g-action-btn g-action-btn--primary" onClick={() => handleEdit(item)}>
                    Ред.
                  </button>
                  <button type="button" className="g-action-btn g-action-btn--danger" onClick={() => handleDelete(item.id)}>
                    Удал.
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- АДМИН: ВКЛАДКА ЗАКАЗЫ (БРОНИ) ---
function AdminOrdersTab({ g }) {
  const [orders, setOrders] = useState([])

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/gamification/admin/orders')
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleUpdateStatus = async (id, status) => {
    const confirmationText = 
      status === 'claimed' 
        ? 'Выдать этот товар ребенку?' 
        : 'Отменить бронь и вернуть коины ребенку?'

    if (!window.confirm(confirmationText)) return

    try {
      const res = await fetch(`/api/gamification/admin/orders/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error')
      }
      loadOrders()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h2 className="g-card-title" style={{ marginBottom: '1.25rem' }}>{g.admin.tabs.orders}</h2>

      <div className="g-table-wrap">
        <table className="g-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{g.admin.orders.child}</th>
              <th>Группа</th>
              <th>Родитель</th>
              <th>{g.admin.orders.item}</th>
              <th>{g.admin.orders.price}</th>
              <th>{g.admin.orders.status}</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'rgba(250, 246, 239, 0.4)' }}>
                  Заказов в системе нет
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td><strong>{o.child_name}</strong></td>
                  <td>{o.age_group}</td>
                  <td>{o.parent_name || '—'}</td>
                  <td>{o.title_ru}</td>
                  <td style={{ color: 'var(--gold)', fontWeight: '700' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      {o.price} <img src="/assets/coin.webp" alt="coin" style={{ width: '0.9rem', height: '0.9rem', objectFit: 'contain' }} />
                    </span>
                  </td>
                  <td>
                    <span 
                      className="g-header-badge" 
                      style={{ 
                        background: o.status === 'claimed' ? '#4ade80' : o.status === 'cancelled' ? 'var(--ribbon)' : 'var(--gold-deep)',
                        color: o.status === 'claimed' ? 'var(--ink)' : 'var(--cream)',
                        fontSize: '0.9rem',
                        padding: '0.3rem 0.65rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {o.status === 'claimed' ? g.admin.orders.claimed : o.status === 'cancelled' ? g.admin.orders.cancelled : g.admin.orders.pending}
                    </span>
                  </td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- АДМИН: ВКЛАДКА ЛОГ ТРАНЗАКЦИЙ ---
function AdminLedgerTab({ g, lang }) {
  const [txs, setTxs] = useState([])

  useEffect(() => {
    fetch('/api/gamification/admin/transactions')
      .then((res) => res.json())
      .then((data) => setTxs(data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div>
      <h2 className="g-card-title" style={{ marginBottom: '1.25rem' }}>{g.admin.tabs.ledger}</h2>

      <div className="g-table-wrap">
        <table className="g-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ребенок / Copil</th>
              <th>Группа</th>
              <th>Сумма / Suma</th>
              <th>Причина / Motiv</th>
              <th>Кто начислил / Autor</th>
              <th>Дата / Data</th>
            </tr>
          </thead>
          <tbody>
            {txs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'rgba(250, 246, 239, 0.4)' }}>
                  Транзакций в системе нет
                </td>
              </tr>
            ) : (
              txs.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td><strong>{tx.child_name}</strong></td>
                  <td>{tx.age_group}</td>
                  <td>
                    <span className={`g-tx-amount ${tx.amount > 0 ? 'g-tx-amount--plus' : 'g-tx-amount--minus'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      <img src="/assets/coin.webp" alt="coin" style={{ width: '0.9rem', height: '0.9rem', objectFit: 'contain' }} />
                    </span>
                  </td>
                  <td>
                    <span>
                      {lang === 'ro' ? tx.title_ro || tx.title_ru : tx.title_ru}
                      {tx.description ? ` (${tx.description})` : ''}
                    </span>
                  </td>
                  <td>{tx.counselor_name || 'Система (Бронь)'}</td>
                  <td>{new Date(tx.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminSellerTab({ g, lang }) {
  const [kids, setKids] = useState([])
  const [pendingItems, setPendingItems] = useState([])
  const [selectedKid, setSelectedKid] = useState(null)
  const [filterGroup, setFilterGroup] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [loadingKid, setLoadingKid] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  // Load all kids on mount/refresh
  const loadKids = useCallback(async () => {
    try {
      const kRes = await fetch('/api/gamification/counselor/children')
      const kData = await kRes.json()
      setKids(kData)
      
      // Update selected kid info (coins balance, etc.)
      if (selectedKid) {
        const updatedKid = kData.find(k => k.profile_id === selectedKid.profile_id)
        setSelectedKid(updatedKid || null)
      }
    } catch (err) {
      console.error(err)
    }
  }, [selectedKid])

  useEffect(() => {
    loadKids()
  }, [])

  // Fetch pending items whenever selected kid changes
  const loadPendingItems = useCallback(async (profileId) => {
    setLoadingKid(true)
    try {
      const res = await fetch(`/api/gamification/admin/orders/pending/${profileId}`)
      const data = await res.json()
      setPendingItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setPendingItems([])
    } finally {
      setLoadingKid(false)
    }
  }, [])

  useEffect(() => {
    if (selectedKid) {
      loadPendingItems(selectedKid.profile_id)
    } else {
      setPendingItems([])
    }
  }, [selectedKid, loadPendingItems])

  const handleIssueItem = async (itemId) => {
    if (!selectedKid) return
    setMessage('')
    setIsError(false)
    setActionLoading(itemId)

    try {
      const res = await fetch('/api/gamification/admin/orders/issue-reserved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childProfileId: selectedKid.profile_id,
          itemId
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Server error')
      }

      setMessage(lang === 'ro' ? 'Premiul a fost eliberat cu succes!' : 'Приз успешно выдан ребенку!')
      
      // Refresh kids balances and update current pending list
      await loadKids()
      await loadPendingItems(selectedKid.profile_id)
    } catch (err) {
      setIsError(true)
      setMessage(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredKids = kids.filter((k) => {
    const matchesGroup = filterGroup === 'all' || k.age_group === filterGroup
    const matchesSearch = k.child_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGroup && matchesSearch
  })

  const isRo = lang === 'ro'

  return (
    <div className="g-counselor-grid">
      {/* Левая панель: Сетка детей */}
      <div className="g-card">
        <div className="g-kids-header">
          <h2 className="g-card-title" style={{ border: 'none', margin: 0, padding: 0 }}>
            {isRo ? 'Copii' : 'Дети'} ({filteredKids.length})
          </h2>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="g-input"
              placeholder={isRo ? 'Căutare...' : 'Поиск...'}
              style={{ width: '160px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="g-select"
              style={{ width: '150px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
            >
              <option value="all">{isRo ? 'Toate grupele' : 'Все группы'}</option>
              <option value="5-8">5–8 (Scouts)</option>
              <option value="9-13">9–13 (Rangers)</option>
            </select>
          </div>
        </div>

        <div className="g-kids-grid">
          {filteredKids.map((kid) => {
            const isSelected = selectedKid && selectedKid.profile_id === kid.profile_id
            return (
              <div 
                className={`g-kid-card ${isSelected ? 'is-selected' : ''}`}
                key={kid.profile_id}
                onClick={() => {
                  setSelectedKid(kid)
                  setMessage('')
                }}
              >
                <div className="g-kid-check">✓</div>
                <div className="g-kid-avatar">{kid.child_name.slice(0, 1)}</div>
                <div className="g-kid-name">{kid.child_name}</div>
                <div className="g-kid-coins" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'center' }}>
                  <img src="/assets/coin.webp" alt="coin" style={{ width: '1rem', height: '1rem', objectFit: 'contain' }} />
                  {kid.coins}
                </div>
                <div className={`g-kid-group ${kid.age_group === '5-8' ? 'g-kid-group--scouts' : 'g-kid-group--rangers'}`}>
                  {kid.age_group === '5-8' ? 'Scouts' : 'Rangers'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Правая панель: Выдача призов */}
      <div className="g-card">
        <h2 className="g-card-title">{isRo ? 'Eliberare premii rezervate' : 'Выдача забронированных призов'}</h2>

        {message && (
          <div 
            className="g-login-error" 
            style={{ 
              marginBottom: '1rem', 
              background: isError ? 'rgba(196,45,66,0.15)' : 'rgba(74,222,128,0.15)',
              borderColor: isError ? 'rgba(196,45,66,0.5)' : 'rgba(74,222,128,0.5)',
              color: isError ? '#ff8b9a' : '#4ade80'
            }}
          >
            {message}
          </div>
        )}

        {selectedKid ? (
          <div>
            <div className="g-selected-count" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span>{isRo ? 'Copil selectat:' : 'Выбран ребенок:'} <strong>{selectedKid.child_name}</strong></span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                {isRo ? 'Balanță:' : 'Баланс:'}
                <img src="/assets/coin.webp" alt="coin" style={{ width: '1.1rem', height: '1.1rem', objectFit: 'contain' }} />
                <strong>{selectedKid.coins}</strong>
              </span>
            </div>

            <h3 style={{ fontSize: '0.9rem', color: 'rgba(250, 246, 239, 0.65)', marginBottom: '0.75rem' }}>
              {isRo ? 'Premii în așteptare:' : 'Ожидают выдачи:'}
            </h3>

            {loadingKid ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--gold)' }}>
                <strong>Loading...</strong>
              </div>
            ) : pendingItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'rgba(250, 246, 239, 0.4)', background: 'rgba(10, 22, 16, 0.25)', borderRadius: '8px' }}>
                {isRo ? 'Niciun premiu rezervat în așteptare.' : 'Нет забронированных призов в ожидании выдачи.'}
              </div>
            ) : (
              <div className="g-award-list">
                {pendingItems.map((item) => {
                  const isIssuing = actionLoading === item.item_id
                  return (
                    <div 
                      className="g-award-option"
                      key={item.item_id}
                      style={{ cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontWeight: 'bold' }}>{isRo ? item.title_ro : item.title_ru}</span>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(250, 246, 239, 0.5)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          {isRo ? `Cantitate: ${item.quantity} buc.` : `Количество: ${item.quantity} шт.`} ({isRo ? 'la' : 'по'} {item.price}
                          <img src="/assets/coin.webp" alt="coin" style={{ width: '0.9rem', height: '0.9rem', objectFit: 'contain' }} />)
                        </span>
                      </div>
                      
                      <button
                        type="button"
                        className="g-action-btn g-action-btn--success"
                        style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', minWidth: '100px' }}
                        disabled={actionLoading !== null}
                        onClick={() => handleIssueItem(item.item_id)}
                      >
                        {isIssuing ? (isRo ? 'Se trimite...' : 'Выдача...') : (isRo ? 'Eliberează' : 'Выдать')}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'rgba(250, 246, 239, 0.4)' }}>
            {isRo ? 'Selectați un copil din lista din stânga pentru a-i elibera premiile pre-comandate.' : 'Выберите ребенка из списка слева, чтобы выдать его забронированные призы.'}
          </div>
        )}
      </div>
    </div>
  )
}
