import crypto from 'crypto'

// --- Вспомогательные функции авторизации ---

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, storedValue) {
  if (!storedValue || !storedValue.includes(':')) return false
  const [salt, hash] = storedValue.split(':')
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === verifyHash
}

// --- Первоначальное заполнение (Seed) ---

export async function seedDatabase(pool) {
  const client = await pool.connect()
  try {
    await client.query('ALTER TABLE children_profiles DROP CONSTRAINT IF EXISTS children_profiles_coins_check')
    await client.query('ALTER TABLE children_profiles ADD CONSTRAINT children_profiles_coins_check CHECK (coins >= -50)')

    // 1. Проверяем и заполняем критерии начисления
    console.log('Checking/seeding earning criteria...')
    if (true) {
      const criteria = [
        {
          title_ru: 'Личный рекорд',
          title_ro: 'Record personal',
          desc_ru: 'За улучшение своего спортивного или творческого результата',
          desc_ro: 'Pentru îmbunătățirea rezultatului personal sportiv sau creativ',
          coins: 10,
          cat: 'activity'
        },
        {
          title_ru: 'Техника дня',
          title_ro: 'Tehnica zilei',
          desc_ru: 'За идеальное выполнение сложного упражнения или элемента',
          desc_ro: 'Pentru executarea ideală a unui exercițiu sau element complex',
          coins: 8,
          cat: 'activity'
        },
        {
          title_ru: 'Железная воля',
          title_ro: 'Voință de fier',
          desc_ru: 'За то, что проявил стойкость и не сдался на тяжелой тренировке',
          desc_ro: 'Pentru perseverență și efort maxim la un antrenament dificil',
          coins: 10,
          cat: 'activity'
        },
        {
          title_ru: 'Режим',
          title_ro: 'Regim',
          desc_ru: 'За быстрый подъем без лишних напоминаний и вовремя сданный телефон',
          desc_ro: 'Pentru trezire rapidă fără mementouri și predarea la timp a telefonului',
          coins: 5,
          cat: 'behavior'
        },
        {
          title_ru: 'Пунктуальность',
          title_ro: 'Punctualitate',
          desc_ru: 'За приход на тренировку или сбор вовремя',
          desc_ro: 'Pentru sosirea la timp la antrenament sau adunare',
          coins: 3,
          cat: 'behavior'
        },
        {
          title_ru: 'Помощь тренеру',
          title_ro: 'Ajutorul antrenorului',
          desc_ru: 'За сбор инвентаря после занятия или помощь в организации',
          desc_ro: 'Pentru strângerea echipamentului după antrenament sau ajutor la organizare',
          coins: 5,
          cat: 'help'
        },
        {
          title_ru: 'Друг команды',
          title_ro: 'Prietenul echipei',
          desc_ru: 'За поддержку товарища по команде, который расстроился из-за проигрыша',
          desc_ro: 'Pentru susținerea unui coechipier întristat de înfrângere',
          coins: 7,
          cat: 'help'
        },
        {
          title_ru: 'Zero Waste',
          title_ro: 'Fără deșeuri',
          desc_ru: 'За уборку мусора (даже чужого) на территории лагеря',
          desc_ro: 'Pentru strângerea gunoiului (chiar și străin) pe teritoriul taberei',
          coins: 5,
          cat: 'behavior'
        },
        {
          title_ru: 'Чистые ладошки',
          title_ro: 'Mâini curate',
          desc_ru: 'За мытье рук перед едой без напоминания вожатого',
          desc_ro: 'Pentru spălarea mâinilor înainte de masă fără memento-ul educatorului',
          coins: 3,
          cat: 'behavior'
        },
        {
          title_ru: 'Поделился с другом',
          title_ro: 'Împărtășit cu un prieten',
          desc_ru: 'За проявление доброты (поделился игрушкой, помог подняться и т.д.)',
          desc_ro: 'Pentru manifestarea bunătății (împărtășirea unei jucării, ajutor la ridicare)',
          coins: 5,
          cat: 'help'
        },
        {
          title_ru: 'Слушаю во все уши',
          title_ro: 'Ascult cu atenție',
          desc_ru: 'Ни разу не отвлекся, пока тренер или вожатый объясняли задание',
          desc_ro: 'Nu s-a distras deloc în timp ce antrenorul sau educatorul explica sarcina',
          coins: 5,
          cat: 'behavior'
        },
        {
          title_ru: 'Железная дисциплина',
          title_ro: 'Disciplină de fier',
          desc_ru: 'Сдал телефон вовремя и без напоминаний вожатого (+5 коинов ежедневно)',
          desc_ro: 'Predarea telefonului la timp și fără mementouri de la educator (+5 coini zilnic)',
          coins: 5,
          cat: 'behavior'
        },
        {
          title_ru: 'Тайм-менеджмент',
          title_ro: 'Time management',
          desc_ru: 'Ни одного опоздания на построение за весь день',
          desc_ro: 'Nicio întârziere la aliniere pe parcursul întregii zile',
          coins: 5,
          cat: 'behavior'
        },
        {
          title_ru: 'Капитанская помощь',
          title_ro: 'Ajutor de căpitan',
          desc_ru: 'Помог тренеру собрать/разложить сложный инвентарь (мячи, фишки)',
          desc_ro: 'A ajutat antrenorul să strângă/aranjeze echipamentul complex (mingi, jaloane)',
          coins: 7,
          cat: 'help'
        },
        {
          title_ru: 'Чистый сектор',
          title_ro: 'Sector curat',
          desc_ru: 'Идеальный порядок в комнате при проверке вожатым',
          desc_ro: 'Ordine ideală în cameră la verificarea de către educator',
          coins: 5,
          cat: 'behavior'
        },
        {
          title_ru: 'Рекорд смены',
          title_ro: 'Recordul turei',
          desc_ru: 'Лучший результат в тесте смены (планка, бег или чеканка мяча)',
          desc_ro: 'Cel mai bun rezultat la testul turei (planșă, alergare sau jonglat mingea)',
          coins: 15,
          cat: 'activity'
        },
        {
          title_ru: 'Анти-конфликт',
          title_ro: 'Anti-conflict',
          desc_ru: 'Умение договориться и решить спор в команде без криков и ссор',
          desc_ro: 'Abilitatea de a negocia și rezolva o dispută în echipă fără strigăte sau ceartă',
          coins: 8,
          cat: 'behavior'
        },
        {
          title_ru: 'Зрительская поддержка',
          title_ro: 'Susținerea spectatorilor',
          desc_ru: 'Активнее всех болел за свою команду во время соревнований',
          desc_ro: 'A susținut cel mai activ echipa sa în timpul competițiilor',
          coins: 5,
          cat: 'activity'
        },
        {
          title_ru: 'Нецензурная лексика (Штраф)',
          title_ro: 'Limbaj licențios (Penalizare)',
          desc_ru: 'Штраф за использование нецензурных слов и выражений',
          desc_ro: 'Penalizare pentru utilizarea cuvintelor obscene',
          coins: -5,
          cat: 'fine'
        },
        {
          title_ru: 'Нарушение дисциплины (Штраф)',
          title_ro: 'Abatere disciplinară (Penalizare)',
          desc_ru: 'Штраф за игнорирование правил лагеря или указаний вожатого',
          desc_ro: 'Penalizare pentru ignorarea regulilor sau a educatorului',
          coins: -5,
          cat: 'fine'
        },
        {
          title_ru: 'Неспортивное поведение (Штраф)',
          title_ro: 'Comportament nesportiv (Penalizare)',
          desc_ru: 'Штраф за буллинг, грубость или неуважение к соперникам и товарищам',
          desc_ro: 'Penalizare pentru bullying, grosolănie sau lipsă de respect',
          coins: -5,
          cat: 'fine'
        }
      ]

      // Удаляем все старые критерии, которых нет в новом списке
      const allowedTitles = criteria.map(c => c.title_ru)
      await client.query(
        'DELETE FROM earning_criteria WHERE title_ru NOT IN (' + allowedTitles.map((_, i) => `$${i + 1}`).join(', ') + ')',
        allowedTitles
      )

      for (const item of criteria) {
        const checkRes = await client.query('SELECT id FROM earning_criteria WHERE title_ru = $1', [item.title_ru])
        if (checkRes.rows.length === 0) {
          await client.query(
            `INSERT INTO earning_criteria (title_ru, title_ro, description_ru, description_ro, default_coins, category)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [item.title_ru, item.title_ro, item.desc_ru, item.desc_ro, item.coins, item.cat]
          )
        }
      }
    }
    // 2. Проверяем и заполняем пользователей
    const usersCount = await client.query('SELECT COUNT(*) FROM users')
    if (parseInt(usersCount.rows[0].count, 10) === 0) {
      console.log('Seeding default users...')
      // Администратор
      const adminHash = hashPassword('MartsFit39!')
      const { rows: adminRows } = await client.query(
        `INSERT INTO users (username, password_hash, role, name)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        ['admin', adminHash, 'admin', 'Super Admin']
      )

      // Воспитатель
      const counselorHash = hashPassword('counselor123')
      await client.query(
        `INSERT INTO users (username, password_hash, role, name)
         VALUES ($1, $2, $3, $4)`,
        ['counselor1', counselorHash, 'counselor', 'Вожатый 1']
      )

      // Родитель
      const parentHash = hashPassword('parent123')
      const { rows: parentRows } = await client.query(
        `INSERT INTO users (username, password_hash, role, name)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        ['parent1', parentHash, 'parent', 'Родитель 1']
      )
      const parentId = parentRows[0].id

      // Дети
      const child1Hash = hashPassword('1111')
      const { rows: child1UserRows } = await client.query(
        `INSERT INTO users (username, password_hash, role, name)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        ['child1', child1Hash, 'child', 'Слава (Scouts)']
      )
      await client.query(
        `INSERT INTO children_profiles (user_id, parent_id, age_group, coins)
         VALUES ($1, $2, $3, $4)`,
        [child1UserRows[0].id, parentId, '5-8', 45] // дадим немного монет на старт
      )

      const child2Hash = hashPassword('2222')
      const { rows: child2UserRows } = await client.query(
        `INSERT INTO users (username, password_hash, role, name)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        ['child2', child2Hash, 'child', 'Алина (Rangers)']
      )
      await client.query(
        `INSERT INTO children_profiles (user_id, parent_id, age_group, coins)
         VALUES ($1, $2, $3, $4)`,
        [child2UserRows[0].id, parentId, '9-13', 110]
      )
    }

    // 3. Проверяем и заполняем витрину товаров
    console.log('Checking/seeding default store items...')
    if (true) {
      const items = [
        { title_ru: 'Браслет MARTS', title_ro: 'Brățară MARTS', price: 30, stock: 50 },
        { title_ru: 'Бутылка для воды', title_ro: 'Sticlă de apă', price: 80, stock: 20 },
        { title_ru: 'Кепка MARTS', title_ro: 'Șapcă MARTS', price: 100, stock: 25 },
        { title_ru: 'Футболка MARTS', title_ro: 'Tricou MARTS', price: 150, stock: 15 },
        { title_ru: 'Гостевой визит другу', title_ro: 'Vizită oaspete pentru un prieten', price: 150, stock: 99 },
        { title_ru: 'Скидочная карта маме 15%', title_ro: 'Card reducere 15% mami', price: 200, stock: 10 }
      ]

      for (const item of items) {
        const checkRes = await client.query('SELECT id FROM store_items WHERE title_ru = $1', [item.title_ru])
        if (checkRes.rows.length === 0) {
          await client.query(
            `INSERT INTO store_items (title_ru, title_ro, price, stock)
             VALUES ($1, $2, $3, $4)`,
            [item.title_ru, item.title_ro, item.price, item.stock]
          )
        }
      }
    }
  } catch (err) {
    console.error('Database seeding failed:', err)
  } finally {
    client.release()
  }
}

// --- Маршруты API (Регистрация роутов в Express) ---

export function registerGamificationRoutes(app, pool) {
  // Миддлвары для проверки ролей
  const requireAuth = (req, res, next) => {
    if (!req.session?.userId) return res.status(401).json({ error: 'Unauthorized' })
    next()
  }

  const requireRole = (roles) => (req, res, next) => {
    if (!req.session?.userId) return res.status(401).json({ error: 'Unauthorized' })
    if (!roles.includes(req.session.role)) return res.status(403).json({ error: 'Forbidden' })
    next()
  }

  // --- 1. Авторизация ---

  app.post('/api/gamification/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' })
    }

    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username.trim().toLowerCase()])
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Неверное имя пользователя или пароль' })
      }

      const user = rows[0]
      if (!verifyPassword(password, user.password_hash)) {
        return res.status(401).json({ error: 'Неверное имя пользователя или пароль' })
      }

      req.session.userId = user.id
      req.session.role = user.role
      req.session.name = user.name

      // Если это ребенок, достаем его профиль
      if (user.role === 'child') {
        const childRes = await pool.query('SELECT id, age_group FROM children_profiles WHERE user_id = $1', [user.id])
        if (childRes.rows.length > 0) {
          req.session.childProfileId = childRes.rows[0].id
          req.session.ageGroup = childRes.rows[0].age_group
        }
      }

      return res.json({
        userId: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      })
    } catch (err) {
      console.error('Login error:', err)
      return res.status(500).json({ error: 'Server error' })
    }
  })

  app.post('/api/gamification/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) console.error('Logout session destroy error', err)
      res.clearCookie('marts.sid', { path: '/' })
      return res.json({ ok: true })
    })
  })

  app.get('/api/gamification/me', (req, res) => {
    if (!req.session?.userId) {
      return res.json({ user: null })
    }
    return res.json({
      user: {
        userId: req.session.userId,
        role: req.session.role,
        name: req.session.name,
        childProfileId: req.session.childProfileId || null,
        ageGroup: req.session.ageGroup || null
      }
    })
  })

  // --- 2. Эндпоинты Воспитателя ---

  // Список детей
  app.get('/api/gamification/counselor/children', requireRole(['counselor', 'admin']), async (req, res) => {
    try {
      const sql = `
        SELECT cp.id AS profile_id, u.name AS child_name, u.username AS child_username, cp.age_group, cp.coins, pu.name AS parent_name
        FROM children_profiles cp
        JOIN users u ON cp.user_id = u.id
        LEFT JOIN users pu ON cp.parent_id = pu.id
        ORDER BY u.name ASC
      `
      const { rows } = await pool.query(sql)
      return res.json(rows)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Список критериев начисления
  app.get('/api/gamification/counselor/criteria', requireRole(['counselor', 'admin']), async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM earning_criteria ORDER BY id ASC')
      return res.json(rows)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Начисление монет (одному или группе детей)
  app.post('/api/gamification/counselor/award', requireRole(['counselor', 'admin']), async (req, res) => {
    const { childProfileIds, criterionId, customAmount, description } = req.body
    if (!childProfileIds || !Array.isArray(childProfileIds) || childProfileIds.length === 0 || !criterionId) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Получаем количество монет из критерия
      const critRes = await client.query('SELECT * FROM earning_criteria WHERE id = $1', [criterionId])
      if (critRes.rows.length === 0) {
        throw new Error('Criterion not found')
      }
      const crit = critRes.rows[0]
      
      let amount = crit.default_coins
      if (customAmount !== undefined && customAmount !== null && customAmount !== '') {
        const val = Number(customAmount)
        if (!isNaN(val)) {
          amount = val
        }
      }

      // Если это штраф (дефолтное значение отрицательное или категория 'fine'), то сумма списания должна быть отрицательной
      if ((crit.default_coins < 0 || crit.category === 'fine') && amount > 0) {
        amount = -amount
      }

      // Начисляем каждому ребенку
      for (const profileId of childProfileIds) {
        // Добавляем запись в транзакции
        await client.query(
          `INSERT INTO coin_transactions (child_profile_id, counselor_id, amount, criterion_id, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [profileId, req.session.userId, amount, criterionId, description || null]
        )

        // Обновляем баланс в профиле ребенка (с защитой от ухода в глубокий минус, лимит -50)
        await client.query(
          `UPDATE children_profiles 
           SET coins = GREATEST(-50, coins + $1) 
           WHERE id = $2`,
          [amount, profileId]
        )
      }

      await client.query('COMMIT')
      return res.json({ success: true, amount })
    } catch (err) {
      await client.query('ROLLBACK')
      console.error('Award error:', err)
      return res.status(500).json({ error: err.message || 'Server error' })
    } finally {
      client.release()
    }
  })

  // Пакетное начисление за ежедневный чек-лист
  app.post('/api/gamification/counselor/daily-checklist', requireRole(['counselor', 'admin']), async (req, res) => {
    const { awards } = req.body
    if (!awards || !Array.isArray(awards)) {
      return res.status(400).json({ error: 'Missing awards array' })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Получаем карту всех критериев для быстрого маппинга
      const critRes = await client.query('SELECT * FROM earning_criteria')
      const criteriaMap = {}
      for (const row of critRes.rows) {
        criteriaMap[row.id] = row
      }

      for (const award of awards) {
        const { childProfileId, criterionId } = award
        if (!childProfileId || !criterionId) continue

        const crit = criteriaMap[criterionId]
        if (!crit) continue

        const amount = crit.default_coins

        // Добавляем запись в транзакции
        await client.query(
          `INSERT INTO coin_transactions (child_profile_id, counselor_id, amount, criterion_id, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [childProfileId, req.session.userId, amount, criterionId, 'Чек-лист дня / Checklist zilnic']
        )

        // Обновляем баланс в профиле ребенка
        await client.query(
          `UPDATE children_profiles 
           SET coins = GREATEST(-50, coins + $1) 
           WHERE id = $2`,
          [amount, childProfileId]
        )
      }

      await client.query('COMMIT')
      return res.json({ success: true })
    } catch (err) {
      await client.query('ROLLBACK')
      console.error('Daily checklist error:', err)
      return res.status(500).json({ error: 'Database error' })
    } finally {
      client.release()
    }
  })

  // --- 3. Эндпоинты Ребенка ---

  // Профиль (баланс)
  app.get('/api/gamification/child/profile', requireRole(['child']), async (req, res) => {
    try {
      const sql = `
        SELECT cp.id AS profile_id, u.name, cp.age_group, cp.coins
        FROM children_profiles cp
        JOIN users u ON cp.user_id = u.id
        WHERE cp.id = $1
      `
      const { rows } = await pool.query(sql, [req.session.childProfileId])
      if (rows.length === 0) return res.status(404).json({ error: 'Profile not found' })
      return res.json(rows[0])
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Лента начислений ребенка
  app.get('/api/gamification/child/transactions', requireRole(['child']), async (req, res) => {
    try {
      const sql = `
        SELECT ct.id, ct.amount, ct.description, ct.created_at,
               ec.title_ru, ec.title_ro, u.name AS counselor_name
        FROM coin_transactions ct
        LEFT JOIN earning_criteria ec ON ct.criterion_id = ec.id
        LEFT JOIN users u ON ct.counselor_id = u.id
        WHERE ct.child_profile_id = $1
        ORDER BY ct.id DESC
      `
      const { rows } = await pool.query(sql, [req.session.childProfileId])
      return res.json(rows)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Магазин (витрина товаров) для ребенка
  app.get('/api/gamification/child/shop', requireRole(['child']), async (req, res) => {
    try {
      // Товары с учетом того, забронировал ли их ребенок
      const sql = `
        SELECT si.*, 
          (SELECT COUNT(*)::int FROM orders o WHERE o.child_profile_id = $1 AND o.store_item_id = si.id AND o.status = 'pending') AS reserved_count
        FROM store_items si
        ORDER BY si.price ASC
      `
      const { rows } = await pool.query(sql, [req.session.childProfileId])
      return res.json(rows)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Бронирование товара
  app.post('/api/gamification/child/shop/reserve', requireRole(['child']), async (req, res) => {
    const { itemId } = req.body
    if (!itemId) return res.status(400).json({ error: 'Missing itemId' })

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Получаем информацию о товаре с блокировкой строки
      const itemRes = await client.query('SELECT * FROM store_items WHERE id = $1 FOR UPDATE', [itemId])
      if (itemRes.rows.length === 0) {
        throw new Error('Товар не найден')
      }
      const item = itemRes.rows[0]

      if (item.stock <= 0) {
        throw new Error('Этого товара нет в наличии')
      }

      // Получаем баланс ребенка с блокировкой
      const childRes = await client.query('SELECT coins FROM children_profiles WHERE id = $1 FOR UPDATE', [req.session.childProfileId])
      const childCoins = childRes.rows[0].coins

      if (childCoins < item.price) {
        throw new Error('Недостаточно MARTS коинов для покупки')
      }

      // 1. Создаем транзакцию списания (отрицательная сумма)
      await client.query(
        `INSERT INTO coin_transactions (child_profile_id, counselor_id, amount, description)
         VALUES ($1, NULL, $2, $3)`,
        [req.session.childProfileId, -item.price, `Забронирован товар: ${item.title_ru}`]
      )

      // 2. Списываем монеты
      await client.query(
        `UPDATE children_profiles SET coins = coins - $1 WHERE id = $2`,
        [item.price, req.session.childProfileId]
      )

      // 3. Уменьшаем остаток товара
      await client.query(
        `UPDATE store_items SET stock = stock - 1 WHERE id = $1`,
        [itemId]
      )

      // 4. Создаем заказ
      await client.query(
        `INSERT INTO orders (child_profile_id, store_item_id, status)
         VALUES ($1, $2, 'pending')`,
        [req.session.childProfileId, itemId]
      )

      await client.query('COMMIT')
      return res.json({ success: true, remainingCoins: childCoins - item.price })
    } catch (err) {
      await client.query('ROLLBACK')
      console.error('Reservation error:', err)
      return res.status(400).json({ error: err.message || 'Ошибка бронирования' })
    } finally {
      client.release()
    }
  })

  // --- 4. Эндпоинты Родителя ---

  // Получить данные по детям родителя
  app.get('/api/gamification/parent/children', requireRole(['parent']), async (req, res) => {
    try {
      const sql = `
        SELECT cp.id AS profile_id, u.name AS child_name, cp.age_group, cp.coins
        FROM children_profiles cp
        JOIN users u ON cp.user_id = u.id
        WHERE cp.parent_id = $1
      `
      const { rows: children } = await pool.query(sql, [req.session.userId])

      const result = []
      for (const child of children) {
        // Достаем транзакции по каждому ребенку
        const txSql = `
          SELECT ct.id, ct.amount, ct.description, ct.created_at,
                 ec.title_ru, ec.title_ro, u.name AS counselor_name
          FROM coin_transactions ct
          LEFT JOIN earning_criteria ec ON ct.criterion_id = ec.id
          LEFT JOIN users u ON ct.counselor_id = u.id
          WHERE ct.child_profile_id = $1
          ORDER BY ct.id DESC
        `
        const { rows: txs } = await pool.query(txSql, [child.profile_id])

        // Достаем заказы по каждому ребенку
        const orderSql = `
          SELECT o.id, o.status, o.created_at, si.title_ru, si.title_ro, si.price
          FROM orders o
          JOIN store_items si ON o.store_item_id = si.id
          WHERE o.child_profile_id = $1
          ORDER BY o.id DESC
        `
        const { rows: orders } = await pool.query(orderSql, [child.profile_id])

        result.push({
          ...child,
          transactions: txs,
          orders: orders
        })
      }

      return res.json(result)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // --- 5. Панель Администратора ---

  // Список всех пользователей
  app.get('/api/gamification/admin/users', requireRole(['admin']), async (req, res) => {
    try {
      const sql = `
        SELECT u.id, u.username, u.role, u.name, u.created_at,
               cp.id AS child_profile_id, cp.age_group, cp.coins, cp.parent_id, pu.name AS parent_name
        FROM users u
        LEFT JOIN children_profiles cp ON u.id = cp.user_id
        LEFT JOIN users pu ON cp.parent_id = pu.id
        ORDER BY u.id DESC
      `
      const { rows } = await pool.query(sql)
      return res.json(rows)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Создание пользователя
  app.post('/api/gamification/admin/users', requireRole(['admin']), async (req, res) => {
    const { username, password, role, name, parentId, ageGroup } = req.body
    if (!username || !password || !role || !name) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Проверяем, свободен ли логин
      const checkRes = await client.query('SELECT id FROM users WHERE username = $1', [username.trim().toLowerCase()])
      if (checkRes.rows.length > 0) {
        throw new Error('Имя пользователя уже занято')
      }

      const passHash = hashPassword(password)
      const { rows: userRows } = await client.query(
        `INSERT INTO users (username, password_hash, role, name)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [username.trim().toLowerCase(), passHash, role, name.trim()]
      )
      const userId = userRows[0].id

      // Если это ребенок, создаем его профиль
      if (role === 'child') {
        if (!ageGroup) {
          throw new Error('Необходимо выбрать возрастную группу для ребенка')
        }
        await client.query(
          `INSERT INTO children_profiles (user_id, parent_id, age_group, coins)
           VALUES ($1, $2, $3, 0)`,
          [userId, parentId || null, ageGroup]
        )
      }

      await client.query('COMMIT')
      return res.json({ success: true, userId })
    } catch (err) {
      await client.query('ROLLBACK')
      console.error(err)
      return res.status(400).json({ error: err.message || 'Ошибка создания пользователя' })
    } finally {
      client.release()
    }
  })

  // Редактирование пользователя
  app.put('/api/gamification/admin/users/:id', requireRole(['admin']), async (req, res) => {
    const userId = parseInt(req.params.id, 10)
    const { name, username, password, parentId, ageGroup } = req.body

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Проверка логина на уникальность (если меняется)
      if (username) {
        const check = await client.query('SELECT id FROM users WHERE username = $1 AND id != $2', [username.trim().toLowerCase(), userId])
        if (check.rows.length > 0) {
          throw new Error('Имя пользователя уже занято')
        }
        await client.query('UPDATE users SET username = $1 WHERE id = $2', [username.trim().toLowerCase(), userId])
      }

      if (name) {
        await client.query('UPDATE users SET name = $1 WHERE id = $2', [name.trim(), userId])
      }

      if (password && password.trim() !== '') {
        const passHash = hashPassword(password)
        await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passHash, userId])
      }

      // Обновляем профиль ребенка, если он есть
      const profileRes = await client.query('SELECT id FROM children_profiles WHERE user_id = $1', [userId])
      if (profileRes.rows.length > 0) {
        const profileId = profileRes.rows[0].id
        if (parentId !== undefined) {
          await client.query('UPDATE children_profiles SET parent_id = $1 WHERE id = $2', [parentId || null, profileId])
        }
        if (ageGroup) {
          await client.query('UPDATE children_profiles SET age_group = $1 WHERE id = $2', [ageGroup, profileId])
        }
      }

      await client.query('COMMIT')
      return res.json({ success: true })
    } catch (err) {
      await client.query('ROLLBACK')
      console.error(err)
      return res.status(400).json({ error: err.message || 'Ошибка редактирования' })
    } finally {
      client.release()
    }
  })

  // Удаление пользователя
  app.delete('/api/gamification/admin/users/:id', requireRole(['admin']), async (req, res) => {
    const userId = parseInt(req.params.id, 10)
    if (userId === req.session.userId) {
      return res.status(400).json({ error: 'Вы не можете удалить самого себя' })
    }
    try {
      await pool.query('DELETE FROM users WHERE id = $1', [userId])
      return res.json({ success: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Магазин - список товаров (Админ)
  app.get('/api/gamification/admin/store', requireRole(['admin']), async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM store_items ORDER BY id DESC')
      return res.json(rows)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Магазин - добавить товар
  app.post('/api/gamification/admin/store', requireRole(['admin']), async (req, res) => {
    const { title_ru, title_ro, price, stock } = req.body
    if (!title_ru || !title_ro || price == null || stock == null) {
      return res.status(400).json({ error: 'Missing fields' })
    }
    try {
      await pool.query(
        `INSERT INTO store_items (title_ru, title_ro, price, stock)
         VALUES ($1, $2, $3, $4)`,
        [title_ru.trim(), title_ro.trim(), Number(price), Number(stock)]
      )
      return res.json({ success: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Магазин - обновить товар
  app.put('/api/gamification/admin/store/:id', requireRole(['admin']), async (req, res) => {
    const itemId = parseInt(req.params.id, 10)
    const { title_ru, title_ro, price, stock } = req.body
    if (!title_ru || !title_ro || price == null || stock == null) {
      return res.status(400).json({ error: 'Missing fields' })
    }
    try {
      await pool.query(
        `UPDATE store_items 
         SET title_ru = $1, title_ro = $2, price = $3, stock = $4
         WHERE id = $5`,
        [title_ru.trim(), title_ro.trim(), Number(price), Number(stock), itemId]
      )
      return res.json({ success: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Магазин - удалить товар
  app.delete('/api/gamification/admin/store/:id', requireRole(['admin']), async (req, res) => {
    const itemId = parseInt(req.params.id, 10)
    try {
      await pool.query('DELETE FROM store_items WHERE id = $1', [itemId])
      return res.json({ success: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Заказы - получить все заказы (Админ)
  app.get('/api/gamification/admin/orders', requireRole(['admin']), async (req, res) => {
    try {
      const sql = `
        SELECT o.id, o.status, o.created_at,
               si.title_ru, si.title_ro, si.price,
               u.name AS child_name, cp.age_group,
               pu.name AS parent_name, pu.username AS parent_username
        FROM orders o
        JOIN children_profiles cp ON o.child_profile_id = cp.id
        JOIN users u ON cp.user_id = u.id
        LEFT JOIN users pu ON cp.parent_id = pu.id
        JOIN store_items si ON o.store_item_id = si.id
        ORDER BY o.id DESC
      `
      const { rows } = await pool.query(sql)
      return res.json(rows)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Изменить статус заказа (выдать / отменить)
  app.post('/api/gamification/admin/orders/:id/status', requireRole(['admin']), async (req, res) => {
    const orderId = parseInt(req.params.id, 10)
    const { status } = req.body // 'claimed', 'cancelled'

    if (!['claimed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Проверяем существование заказа с блокировкой строки
      const orderRes = await client.query(
        `SELECT o.*, si.title_ru, si.price, si.id AS item_id
         FROM orders o
         JOIN store_items si ON o.store_item_id = si.id
         WHERE o.id = $1 FOR UPDATE`,
        [orderId]
      )
      if (orderRes.rows.length === 0) {
        throw new Error('Заказ не найден')
      }
      const order = orderRes.rows[0]

      if (order.status !== 'pending') {
        throw new Error('Этот заказ уже обработан')
      }

      if (status === 'claimed') {
        // 1. Меняем статус на выданный
        await client.query('UPDATE orders SET status = $1 WHERE id = $2', ['claimed', orderId])
      } else if (status === 'cancelled') {
        // 1. Возвращаем монеты ребенку
        await client.query('UPDATE children_profiles SET coins = coins + $1 WHERE id = $2', [order.price, order.child_profile_id])

        // 2. Создаем транзакцию возврата монет
        await client.query(
          `INSERT INTO coin_transactions (child_profile_id, counselor_id, amount, description)
           VALUES ($1, NULL, $2, $3)`,
          [order.child_profile_id, order.price, `Возврат монет за отмену брони: ${order.title_ru}`]
        )

        // 3. Возвращаем товар на склад
        await client.query('UPDATE store_items SET stock = stock + 1 WHERE id = $1', [order.item_id])

        // 4. Обновляем статус заказа
        await client.query('UPDATE orders SET status = $1 WHERE id = $2', ['cancelled', orderId])
      }

      await client.query('COMMIT')
      return res.json({ success: true })
    } catch (err) {
      await client.query('ROLLBACK')
      console.error(err)
      return res.status(400).json({ error: err.message || 'Server error' })
    } finally {
      client.release()
    }
  })

  // Получить сгруппированные забронированные призы ребенка (Админ/Продавец)
  app.get('/api/gamification/admin/orders/pending/:childProfileId', requireRole(['admin']), async (req, res) => {
    const childProfileId = parseInt(req.params.childProfileId, 10)
    try {
      const sql = `
        SELECT o.store_item_id AS item_id, si.title_ru, si.title_ro, si.price, COUNT(*)::int AS quantity
        FROM orders o
        JOIN store_items si ON o.store_item_id = si.id
        WHERE o.child_profile_id = $1 AND o.status = 'pending'
        GROUP BY o.store_item_id, si.title_ru, si.title_ro, si.price
      `
      const { rows } = await pool.query(sql, [childProfileId])
      return res.json(rows)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Выдать забронированные призы (группой по товару) (Админ/Продавец)
  app.post('/api/gamification/admin/orders/issue-reserved', requireRole(['admin']), async (req, res) => {
    const { childProfileId, itemId } = req.body
    if (!childProfileId || !itemId) {
      return res.status(400).json({ error: 'Missing childProfileId or itemId' })
    }

    try {
      const sql = `
        UPDATE orders 
        SET status = 'claimed'
        WHERE child_profile_id = $1 AND store_item_id = $2 AND status = 'pending'
      `
      const result = await pool.query(sql, [childProfileId, itemId])
      return res.json({ success: true, count: result.rowCount })
    } catch (err) {
      console.error('Error issuing reserved prizes:', err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Лог всех транзакций (Админ)
  app.get('/api/gamification/admin/transactions', requireRole(['admin']), async (req, res) => {
    try {
      const sql = `
        SELECT ct.id, ct.amount, ct.description, ct.created_at,
               ec.title_ru, ec.title_ro,
               u.name AS counselor_name,
               cu.name AS child_name, cp.age_group
        FROM coin_transactions ct
        LEFT JOIN earning_criteria ec ON ct.criterion_id = ec.id
        LEFT JOIN users u ON ct.counselor_id = u.id
        JOIN children_profiles cp ON ct.child_profile_id = cp.id
        JOIN users cu ON cp.user_id = cu.id
        ORDER BY ct.id DESC
      `
      const { rows } = await pool.query(sql)
      return res.json(rows)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })

  // Рейтинг участников лагеря (публичный эндпоинт)
  app.get('/api/gamification/rating', async (req, res) => {
    try {
      const sql = `
        SELECT u.name, cp.age_group, cp.coins
        FROM children_profiles cp
        JOIN users u ON cp.user_id = u.id
        ORDER BY cp.coins DESC, u.name ASC
      `
      const { rows } = await pool.query(sql)
      return res.json(rows)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error' })
    }
  })
}
