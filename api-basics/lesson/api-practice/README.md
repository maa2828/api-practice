# タスク管理API

## 概要

タスクの登録・取得・更新・削除を行うREST APIです。

## 使用技術

* TypeScript
* Express
* PostgreSQL
* Prisma
* JWT
* Jest
* Supertest

## データモデル

Task

* id
* title
* done
* createdAt

## エンドポイント

| Method | Path        | 認証 |
| ------ | ----------- | -- |
| GET    | /health     | 不要 |
| POST   | /auth/login | 不要 |
| GET    | /tasks      | 不要 |
| GET    | /tasks/:id  | 不要 |
| POST   | /tasks      | 必要 |
| PUT    | /tasks/:id  | 必要 |
| DELETE | /tasks/:id  | 必要 |

## エラー形式

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "invalid request"
  }
}
```

