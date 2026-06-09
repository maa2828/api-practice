## 小さな設計例（農家向け日記アプリ）

### usersテーブル

- id (PK)
- name

### cropsテーブル

- id (PK)
- name

### diariesテーブル

- id (PK)
- user_id (FK)
- crop_id (FK)
- title
- body

### テーブルの関係

users → diaries

crops → diaries

どのユーザーが、どの作物について日記を書いたかを管理できる。