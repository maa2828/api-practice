-- users：ユーザー
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

-- categories：カテゴリ
CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- expenses：支出（家計簿）
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  paid_at TEXT NOT NULL,
  memo TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);