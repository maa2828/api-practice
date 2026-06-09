-- 0) 全件取得
SELECT * FROM expenses;

-- 1) user_id=1 の支出だけ
SELECT * FROM expenses
WHERE user_id = 1;

-- 2) amount の降順で上位3件
SELECT * FROM expenses
ORDER BY amount DESC
LIMIT 3;