INSERT INTO users (id, name, email, created_at) VALUES
  (1, 'Alice', 'alice@example.com', '2026-01-01'),
  (2, 'Bob',   'bob@example.com',   '2026-01-05');

INSERT INTO categories (id, name) VALUES
  (1, '食費'),
  (2, '交通'),
  (3, '日用品'),
  (4, '娯楽');

INSERT INTO expenses (id, user_id, category_id, title, amount, paid_at, memo) VALUES
  (1, 1, 1, 'ランチ',          900,  '2026-01-10', '社食'),
  (2, 1, 2, '電車',            420,  '2026-01-10', NULL),
  (3, 1, 4, '映画',           1800,  '2026-01-12', 'IMAX'),
  (4, 2, 1, 'スーパー',       3200,  '2026-01-11', NULL),
  (5, 2, 3, '洗剤',            650,  '2026-01-12', 'まとめ買い'),
  (6, 2, 2, 'バス',            210,  '2026-01-12', NULL),
  (7, 1, 1, 'カフェ',          550,  '2026-01-13', NULL),
  (8, 1, 3, 'ティッシュ',      300,  '2026-01-14', NULL),
  (9, 2, 4, 'ゲーム課金',     1200,  '2026-01-14', '少額'),
  (10,2, 1, '夕食',           1400,  '2026-01-14', NULL);