/** @typedef {'ru' | 'ro'} Lang */

const ru = {
  nav: {
    logoMain: 'MARTS FITNESS',
    logoSub: 'Лето на драйве!',
    program: 'Программа',
    week1: 'Неделя 1',
    week2: 'Неделя 2',
    benefits: '5 фишек',
    contact: 'Контакты',
    signup: 'Войти в Аккаунт',
    navAria: 'Основная навигация',
    menuOpenAria: 'Открыть меню',
    menuCloseAria: 'Закрыть меню',
  },
  langSwitch: 'RO',
  langSwitchAria: 'Переключить на румынский',
  hero: {
    logoFallback: 'MARTS FITNESS',
    title: 'ЛЕТО НА ДРАЙВЕ!',
    subtitle: 'Детский фитнес-лагерь',
    ribbon: 'ПН – ПТ · 09:00 – 13:00',
    factWho: 'Для кого:',
    factWhoText: '2 группы (5–8 лет и 9–13 лет).',
    factTime: 'Время:',
    factTimeText: 'Пн – Пт, с 09:00 до 13:00.',
    factFormat: 'Формат:',
    factFormatText: 'Фитнес + Безопасность + Творчество.',
    signup: 'Записаться',
    viewProgram: 'Рейтинг',
    booking: 'Бронь мест:',
    addressLabel: 'Адрес:',
    sep: '|',
  },
  programIntro: {
    sectionAria: 'Обзор программы',
    imageAlt: 'Две недели приключений: расписание и тематические дни',
  },
  benefits: {
    woodTitle: '5 ФИШЕК СМЕНЫ',
    highlights: [
      { text: 'Самооборона и безопасность на перекрёстках.' },
      { text: 'Фитнес-прокачка: квесты и тренировки «Выживание».' },
      { text: 'Перекус чемпиона: топливо для юных героев.' },
      { text: 'Марц-коины: игровая валюта за активность.' },
      { text: 'Крутые призы: от браслетов до кроссовок и скидки 15% на абонемент для мамы!' },
    ],
  },
  schedule: {
    themeRow: 'Тема дня',
    juniorGroup: 'MARTS SCOUTS',
    proGroup: 'MARTS RANGERS',
    ageJunior: '5–8 лет',
    agePro: '9–13 лет',
    artRow: 'АРТ КЛАСС',
    gamesRow: 'ПОДВИЖНЫЕ ИГРЫ',
  },
  footer: {
    title: 'Лето на драйве!',
    tagline: 'Детский фитнес-лагерь MARTS FITNESS: фитнес, безопасность и творчество.',
    contactSales: 'Связаться с отделом продаж',
    creditIntro: 'Разработано командой',
    creditBrand: 'cyberfolks',
  },
  cta: {
    bannerMain: 'ПРИСОЕДИНЯЙСЯ К ПРИКЛЮЧЕНИЮ!',
    bannerSub: 'НОВЫЕ ДРУЗЬЯ • ЯРКИЕ ЭМОЦИИ • НЕЗАБЫВАЕМЫЕ ВПЕЧАТЛЕНИЯ',
    label: 'Запись',
    title: 'Забронировать место',
    namePh: 'Имя родителя',
    phonePh: 'Телефон',
    age58: '5–8 лет (MARTS SCOUTS)',
    age913: '9–13 лет (MARTS RANGERS)',
    submit: 'Отправить заявку',
    sending: 'Отправка...',
    errorSend: 'Ошибка отправки',
    errorServer: 'Ошибка сервера',
    consentLabel: 'Я согласен на обработку моих данных',
    policyModalAria: 'Политика обработки персональных данных',
  },
  successModal: {
    close: 'Закрыть',
    line1: 'Заявка успешно отправлена',
    line2: 'Вскоре с Вами свяжется отдел продаж',
    brand: 'MARTS FITNESS',
    wait: 'Не хотите ждать?',
    cta: 'Свяжитесь с нами сейчас!',
    limited: 'Места ограничены',
    operator: 'Оператор',
  },
  gamification: {
    login: {
      title: 'Вход в MARTS CAMP',
      sub: 'Система геймификации детского лагеря',
      user: 'Имя пользователя (Логин)',
      pass: 'Пароль (или PIN)',
      btn: 'Войти',
      error: 'Неверный логин или пароль',
      childHint: 'Дети входят по логину (напр. child1) и PIN-коду (напр. 1111)'
    },
    roles: {
      admin: 'Супер-админ',
      counselor: 'Вожатый',
      parent: 'Родитель',
      child: 'Ребенок'
    },
    child: {
      balance: 'Баланс коинов',
      ageGroup: 'Группа',
      history: 'История достижений',
      shop: 'Магазин призов',
      reserve: 'Забронировать',
      reserved: 'Забронировано',
      noStock: 'Нет в наличии',
      successReserve: 'Товар успешно забронирован! Заберите его в фитнес-клубе.',
      noCoins: 'Недостаточно MARTS коинов!'
    },
    parent: {
      title: 'Кабинет родителя',
      childCoins: 'Баланс ребенка',
      childHistory: 'История начислений',
      childOrders: 'Забронированные призы',
      noChildren: 'К вашему аккаунту не привязаны дети. Обратитесь к администратору.'
    },
    counselor: {
      title: 'Кабинет вожатого',
      allGroups: 'Все группы',
      scouts: 'MARTS SCOUTS (5-8 лет)',
      rangers: 'MARTS RANGERS (9-13 лет)',
      awardTitle: 'Начислить коины',
      selectChild: 'Выберите одного или нескольких детей из списка слева',
      selectCriterion: 'Выберите критерий начисления:',
      comment: 'Добавить комментарий (напр. за помощь на Арт-классе)',
      awardBtn: 'Начислить коины',
      success: 'Коины успешно начислены!'
    },
    admin: {
      title: 'Панель администратора',
      tabs: {
        users: 'Пользователи',
        store: 'Магазин призов',
        orders: 'Заказы',
        ledger: 'Лог транзакций',
        seller: 'Выдача призов'
      },
      users: {
        addBtn: 'Добавить пользователя',
        username: 'Логин',
        name: 'Имя',
        role: 'Роль',
        parent: 'Родитель',
        group: 'Группа',
        actions: 'Действия',
        save: 'Сохранить',
        cancel: 'Отмена'
      },
      store: {
        addBtn: 'Добавить товар',
        title: 'Название',
        price: 'Цена (коины)',
        stock: 'Остаток'
      },
      orders: {
        child: 'Ребенок',
        item: 'Приз',
        price: 'Цена',
        status: 'Статус',
        actions: 'Действия',
        approve: 'Выдать',
        cancel: 'Отменить',
        pending: 'В ожидании',
        claimed: 'Выдан',
        cancelled: 'Отменен'
      }
    }
  }
}

const ro = {
  nav: {
    logoMain: 'MARTS FITNESS',
    logoSub: 'Vară pe drive',
    program: 'Program',
    week1: 'Săptămâna 1',
    week2: 'Săptămâna 2',
    benefits: '5 atuuri',
    contact: 'Contact',
    signup: 'Conectare Cont',
    navAria: 'Navigare principală',
    menuOpenAria: 'Deschide meniul',
    menuCloseAria: 'Închide meniul',
  },
  langSwitch: 'RU',
  langSwitchAria: 'Trece la limba rusă',
  hero: {
    logoFallback: 'MARTS FITNESS',
    title: 'VARĂ PE DRIVE!',
    subtitle: 'Tabăra de fitness pentru copii',
    ribbon: 'LUN–VIN · 09:00 – 13:00',
    factWho: 'Pentru cine:',
    factWhoText: '2 grupe (5–8 ani și 9–13 ani).',
    factTime: 'Program:',
    factTimeText: 'Luni – vineri, 09:00 – 13:00.',
    factFormat: 'Format:',
    factFormatText: 'Fitness + Siguranță + Creativitate.',
    signup: 'Înscrie-te',
    viewProgram: 'Clasament',
    booking: 'Rezervă loc:',
    addressLabel: 'Adresa:',
    sep: '|',
  },
  programIntro: {
    sectionAria: 'Prezentare program',
    imageAlt: 'Două săptămâni de aventură: programul și zilele tematice',
  },
  benefits: {
    woodTitle: '5 ATUURI ALE TABEREI',
    highlights: [
      { text: 'Autoapărare și siguranță la treceri complicate.' },
      { text: 'Fitness intens: questuri și antrenamentul „Supraviețuire”.' },
      { text: 'Gustarea campionului: combustibil pentru tinerii eroi.' },
      { text: 'Marț-coinuri: monedă de joc pentru activitate.' },
      { text: 'Premii tari: de la brățări la adidași și 15% reducere la abonament pentru mamă!' },
    ],
  },
  schedule: {
    themeRow: 'Tema zilei',
    juniorGroup: 'MARTS SCOUTS',
    proGroup: 'MARTS RANGERS',
    ageJunior: '5–8 ani',
    agePro: '9–13 ani',
    artRow: 'ARTĂ',
    gamesRow: 'JOCURI DINAMICE',
  },
  footer: {
    title: 'Vară pe drive!',
    tagline: 'Tabăra de fitness pentru copii MARTS FITNESS: fitness, siguranță și creativitate.',
    contactSales: 'Contactează departamentul de vânzări',
    creditIntro: 'Realizat de echipa',
    creditBrand: 'cyberfolks',
  },
  cta: {
    bannerMain: 'INTRĂ ÎN AVENTURĂ!',
    bannerSub: 'PRIETENI NOI • EMOȚII PUTERNICE • AMINTIRI DE NEUITAT',
    label: 'Înscriere',
    title: 'Rezervă un loc',
    namePh: 'Numele părintelui',
    phonePh: 'Telefon',
    age58: '5–8 ani (MARTS SCOUTS)',
    age913: '9–13 ani (MARTS RANGERS)',
    submit: 'Trimite cererea',
    sending: 'Se trimite...',
    errorSend: 'Eroare la trimitere',
    errorServer: 'Eroare de server',
    consentLabel: 'Sunt de acord cu prelucrarea datelor mele',
    policyModalAria: 'Politica de prelucrare a datelor cu caracter personal',
  },
  successModal: {
    close: 'Închide',
    line1: 'Cererea a fost trimisă cu succes',
    line2: 'În curând te contactează echipa de vânzări',
    brand: 'MARTS FITNESS',
    wait: 'Nu vrei să aștepți?',
    cta: 'Contactează-ne acum!',
    limited: 'Locuri limitate',
    operator: 'Operator',
  },
  gamification: {
    login: {
      title: 'Autentificare MARTS CAMP',
      sub: 'Sistemul de gamificare al taberei',
      user: 'Nume utilizator (Login)',
      pass: 'Parolă (sau PIN)',
      btn: 'Conectare',
      error: 'Nume de utilizator sau parolă incorectă',
      childHint: 'Copiii se conectează cu login (ex. child1) și codul PIN (ex. 1111)'
    },
    roles: {
      admin: 'Super-admin',
      counselor: 'Educator',
      parent: 'Părinte',
      child: 'Copil'
    },
    child: {
      balance: 'Balanță coini',
      ageGroup: 'Grupa',
      history: 'Istoric realizări',
      shop: 'Magazin premii',
      reserve: 'Rezervă',
      reserved: 'Rezervat',
      noStock: 'Stoc epuizat',
      successReserve: 'Produsul a fost rezervat cu succes! Ridică-l de la club.',
      noCoins: 'Coini MARTS insuficienți!'
    },
    parent: {
      title: 'Cabinet părinte',
      childCoins: 'Balanță copil',
      childHistory: 'Istoric acumulări',
      childOrders: 'Premii rezervate',
      noChildren: 'Nu aveți copii asociați cu contul dvs. Contactați administratorul.'
    },
    counselor: {
      title: 'Cabinet educator',
      allGroups: 'Toate grupele',
      scouts: 'MARTS SCOUTS (5-8 ani)',
      rangers: 'MARTS RANGERS (9-13 ani)',
      awardTitle: 'Acordă coini',
      selectChild: 'Selectați unul sau mai mulți copii din lista din stânga',
      selectCriterion: 'Selectați criteriul de acordare:',
      comment: 'Adăugați comentariu (ex. pentru ajutor la clasa de artă)',
      awardBtn: 'Acordă coini',
      success: 'Coinii au fost acordați cu succes!'
    },
    admin: {
      title: 'Panou administrativ',
      tabs: {
        users: 'Utilizatori',
        store: 'Magazin',
        orders: 'Comenzi',
        ledger: 'Tranzacții',
        seller: 'Distribuire premii'
      },
      users: {
        addBtn: 'Adaugă utilizator',
        username: 'Login',
        name: 'Nume',
        role: 'Rol',
        parent: 'Părinte',
        group: 'Grupa',
        actions: 'Acțiuni',
        save: 'Salvează',
        cancel: 'Anulează'
      },
      store: {
        addBtn: 'Adaugă produs',
        title: 'Denumire',
        price: 'Preț (coini)',
        stock: 'Stoc'
      },
      orders: {
        child: 'Copil',
        item: 'Premiu',
        price: 'Preț',
        status: 'Statut',
        actions: 'Acțiuni',
        approve: 'Eliberează',
        cancel: 'Anulează',
        pending: 'În așteptare',
        claimed: 'Eliberat',
        cancelled: 'Anulat'
      }
    }
  }
}

/** @type {Record<Lang, typeof ru>} */
export const messages = { ru, ro }
