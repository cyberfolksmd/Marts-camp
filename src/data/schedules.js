/** Расписание по языкам — структура как в таблице лагеря (тема дня + арт/игры по группам) */

const week1Ru = {
  meta: { title: 'ПЕРВАЯ НЕДЕЛЯ', variant: 'blue' },
  days: [
    {
      dayShort: 'ПН',
      dayFull: 'ПОНЕДЕЛЬНИК',
      theme: 'ГОЛОВОЛОМКА',
      junior: { art: 'Оригами «Эмоции»', games: 'Игра «Создай свою эмоцию»' },
      pro: { art: 'Оригами «Эмоции»', games: 'Игра «Создай свою эмоцию»' },
    },
    {
      dayShort: 'ВТ',
      dayFull: 'ВТОРНИК',
      theme: 'УНИВЕРСИТЕТ\nМОНСТРОВ',
      junior: { art: 'Создание «Страшной короны»', games: 'Игра «Охота на монстра»' },
      pro: { art: 'Дизайн студенческого билета монстра', games: 'Игра «Охота на монстра»' },
    },
    {
      dayShort: 'СР',
      dayFull: 'СРЕДА',
      theme: 'РАТАТУЙ',
      junior: { art: 'Делаем торт «Тирамису»', games: 'Эстафета «Овощи против фруктов»' },
      pro: { art: 'Делаем торт «Тирамису»', games: 'Эстафета «Овощи против фруктов»' },
    },
    {
      dayShort: 'ЧТ',
      dayFull: 'ЧЕТВЕРГ',
      theme: 'ПИРАТЫ\nКАРИБСКОГО\nМОРЯ',
      junior: { art: 'Создание пиратского корабля', games: 'Основы самообороны' },
      pro: { art: 'Создание пиратского сундука', games: 'Основы самообороны' },
    },
    {
      dayShort: 'ПТ',
      dayFull: 'ПЯТНИЦА',
      theme: 'КИНОМАНИЯ',
      junior: { art: 'Мастер класс «Кадр века»', games: 'Кино с попкорном' },
      pro: { art: 'Кино с попкорном', games: 'Снимаем видео «Твой звездный час»' },
    },
  ],
}

const week2Ru = {
  meta: { title: 'ВТОРАЯ НЕДЕЛЯ', variant: 'purple' },
  days: [
    {
      dayShort: 'ПН',
      dayFull: 'ПОНЕДЕЛЬНИК',
      theme: 'ДЖУМАНЖИ',
      junior: { art: 'Изготовление масок диких животных', games: 'Игра «Полоса препятствий»' },
      pro: { art: 'Изготовление игры «Карта джунглей»', games: 'Функциональная тренировка «Выживание»' },
    },
    {
      dayShort: 'ВТ',
      dayFull: 'ВТОРНИК',
      theme: 'АЛИСА В\nСТРАНЕ ЧУДЕС',
      junior: { art: 'Создание живых карт', games: 'Квест «Кроличья нора»' },
      pro: { art: 'Создание цилиндра кролика', games: 'Квест «Кроличья нора»' },
    },
    {
      dayShort: 'СР',
      dayFull: 'СРЕДА',
      theme: 'ЗВЕРОПОЛИС',
      junior: {
        art: 'Делаем значок офицера полиции',
        games: 'Игра «Безопасность в городе и как переходить сложные перекрёстки»',
      },
      pro: {
        art: 'Создание брелка на рюкзак из бисера',
        games: 'Игра «Безопасность в городе и как переходить сложные перекрёстки»',
      },
    },
    {
      dayShort: 'ЧТ',
      dayFull: 'ЧЕТВЕРГ',
      theme: 'ГАРРИ ПОТТЕР',
      junior: { art: 'Создание волшебного зелья', games: 'Игра «Квиддич»' },
      pro: { art: 'Создание волшебного зелья', games: 'Игра «Квиддич»' },
    },
    {
      dayShort: 'ПТ',
      dayFull: 'ПЯТНИЦА',
      theme: 'КИНОМАНИЯ',
      junior: { art: 'Мастер класс «Кадр века»', games: 'Кино с попкорном' },
      pro: { art: 'Кино с попкорном', games: 'Снимаем видео «Твой звездный час»' },
    },
  ],
}

const week1Ro = {
  meta: { title: 'SĂPTĂMÂNA 1', variant: 'blue' },
  days: [
    {
      dayShort: 'Lu',
      dayFull: 'LUNI',
      theme: 'PUZZLE-URI',
      junior: { art: 'Origami „Emoții”', games: 'Joc „Creează-ți emoția”' },
      pro: { art: 'Origami „Emoții”', games: 'Joc „Creează-ți emoția”' },
    },
    {
      dayShort: 'Ma',
      dayFull: 'MARȚI',
      theme: 'UNIVERSITATEA\nMONȘTRILOR',
      junior: { art: '„Coroana înfricoșătoare”', games: 'Joc „Vânătoarea de monstru”' },
      pro: { art: 'Design carnet student monstru', games: 'Joc „Vânătoarea de monstru”' },
    },
    {
      dayShort: 'Mi',
      dayFull: 'MIERCURI',
      theme: 'RATATOUILLE',
      junior: { art: 'Tort „Tiramisu”', games: 'Ștafetă „Legume vs. fructe”' },
      pro: { art: 'Tort „Tiramisu”', games: 'Ștafetă „Legume vs. fructe”' },
    },
    {
      dayShort: 'Jo',
      dayFull: 'JOI',
      theme: 'PIRAȚII\nDIN\nCARAIBE',
      junior: { art: 'Corabie pirat', games: 'Bazele autoapărării' },
      pro: { art: 'Cufăr pirat', games: 'Bazele autoapărării' },
    },
    {
      dayShort: 'Vi',
      dayFull: 'VINERI',
      theme: 'CINEMANIA',
      junior: { art: 'Masterclass „Cadru de aur”', games: 'Film cu popcorn' },
      pro: { art: 'Film cu popcorn', games: 'Clip „Momentul tău de vedetă”' },
    },
  ],
}

const week2Ro = {
  meta: { title: 'SĂPTĂMÂNA 2', variant: 'purple' },
  days: [
    {
      dayShort: 'Lu',
      dayFull: 'LUNI',
      theme: 'JUMANJI',
      junior: { art: 'Măști animale sălbatice', games: 'Joc „Traseu cu obstacole”' },
      pro: { art: 'Joc „Harta junglei”', games: 'Antrenament funcțional „Supraviețuire”' },
    },
    {
      dayShort: 'Ma',
      dayFull: 'MARȚI',
      theme: 'ALICE ÎN\nȚARA MINUNILOR',
      junior: { art: 'Hărți vii', games: 'Quest „Vizuința iepurașului”' },
      pro: { art: 'Cilindru de magician', games: 'Quest „Vizuința iepurașului”' },
    },
    {
      dayShort: 'Mi',
      dayFull: 'MIERCURI',
      theme: 'ZOOTOPIA',
      junior: {
        art: 'Insignă ofițer de poliție',
        games: 'Joc „Siguranță în oraș și traversări dificile”',
      },
      pro: {
        art: 'Breloc rucsac din mărgele',
        games: 'Joc „Siguranță în oraș și traversări dificile”',
      },
    },
    {
      dayShort: 'Jo',
      dayFull: 'JOI',
      theme: 'HARRY POTTER',
      junior: { art: 'Poțiune magică', games: 'Joc „Quidditch”' },
      pro: { art: 'Poțiune magică', games: 'Joc „Quidditch”' },
    },
    {
      dayShort: 'Vi',
      dayFull: 'VINERI',
      theme: 'CINEMANIA',
      junior: { art: 'Masterclass „Cadru de aur”', games: 'Film cu popcorn' },
      pro: { art: 'Film cu popcorn', games: 'Clip „Momentul tău de vedetă”' },
    },
  ],
}

export const schedules = {
  ru: { week1: week1Ru, week2: week2Ru },
  ro: { week1: week1Ro, week2: week2Ro },
}
