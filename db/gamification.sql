-- Схема и базовые данные для системы геймификации MARTS CAMP

-- 1. Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL, -- 'admin', 'counselor', 'parent', 'child'
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Профили детей
CREATE TABLE IF NOT EXISTS children_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  age_group VARCHAR(20) NOT NULL, -- '5-8', '9-13'
  coins INTEGER NOT NULL DEFAULT 0 CHECK (coins >= 0)
);

-- 3. Критерии начисления коинов
CREATE TABLE IF NOT EXISTS earning_criteria (
  id SERIAL PRIMARY KEY,
  title_ru VARCHAR(100) NOT NULL,
  title_ro VARCHAR(100) NOT NULL,
  description_ru TEXT,
  description_ro TEXT,
  default_coins INTEGER NOT NULL DEFAULT 5,
  category VARCHAR(50) NOT NULL -- 'behavior', 'help', 'activity', 'theme_task', 'art', 'custom'
);

-- 4. Транзакции коинов
CREATE TABLE IF NOT EXISTS coin_transactions (
  id SERIAL PRIMARY KEY,
  child_profile_id INTEGER NOT NULL REFERENCES children_profiles(id) ON DELETE CASCADE,
  counselor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  criterion_id INTEGER REFERENCES earning_criteria(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Витрина товаров (Магазин призов)
CREATE TABLE IF NOT EXISTS store_items (
  id SERIAL PRIMARY KEY,
  title_ru VARCHAR(100) NOT NULL,
  title_ro VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_name VARCHAR(100)
);

-- 6. Заказы призов
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  child_profile_id INTEGER NOT NULL REFERENCES children_profiles(id) ON DELETE CASCADE,
  store_item_id INTEGER NOT NULL REFERENCES store_items(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'claimed', 'cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для ускорения поиска
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_children_user ON children_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_children_parent ON children_profiles (parent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_child ON coin_transactions (child_profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_child ON orders (child_profile_id);
