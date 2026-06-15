| 仕様（38） | 実装ファイル | 備考 |
|------------|------------|------|
| GET /users | routes/users.routes.ts | 一覧取得 |
| GET /users/:id | routes/users.routes.ts | 1件取得 |
| POST /users | routes/users.routes.ts | ユーザー作成 |
| PUT /users/:id | routes/users.routes.ts | ユーザー更新 |
| DELETE /users/:id | routes/users.routes.ts | ユーザー削除 |
| POST /auth/login | auth/auth.routes.ts | JWT発行 |
| GET /users/me | routes/users.routes.ts | 認証必須 |
| GET /users/admin/secret | routes/users.routes.ts | admin権限必須 |
| バリデーション | lib/validate.ts | name/emailチェック |
| エラー形式 | lib/errors.ts | 400/404共通化 |

## セキュリティ対策

- helmet を導入し、HTTPヘッダーのセキュリティを強化した
- express-rate-limit を導入し、短時間の大量アクセスを制限した
- JWT認証を導入した
- パスワードをbcryptでハッシュ化した
- エラー詳細をレスポンスに返さないようにした

## やってはいけないこと

- SQLを文字列連結で作る
- パスワードを平文保存する
- JWT_SECRETをソースコードに直接書く
- エラー詳細やスタックトレースをそのまま返す