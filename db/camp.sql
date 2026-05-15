-- База: marts_db, таблица: camp
-- Выполните в psql или в клиенте PostgreSQL.

CREATE TABLE IF NOT EXISTS camp (
  id SERIAL PRIMARY KEY,
  done BOOLEAN NOT NULL DEFAULT FALSE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  age TEXT NOT NULL,
  name TEXT NOT NULL,
  tel TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS camp_date_idx ON camp (date DESC);
CREATE INDEX IF NOT EXISTS camp_id_desc_idx ON camp (id DESC);

-- Если таблица уже была без колонки «галочка»:
-- ALTER TABLE camp ADD COLUMN IF NOT EXISTS done BOOLEAN NOT NULL DEFAULT FALSE;

-- Если при INSERT падало ограничение на id (NOT NULL без sequence / default):
-- Вариант 1 — привязать последовательность к колонке id (предпочтительно):
-- CREATE SEQUENCE IF NOT EXISTS camp_id_seq;
-- SELECT setval('camp_id_seq', COALESCE((SELECT MAX(id) FROM camp), 0));
-- ALTER TABLE camp ALTER COLUMN id SET DEFAULT nextval('camp_id_seq');
-- ALTER SEQUENCE camp_id_seq OWNED BY camp.id;

-- Вариант 2 — пересоздать id как SERIAL (осторожно: только на пустой/тестовой таблице).
