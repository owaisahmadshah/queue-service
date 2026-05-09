import { injectable } from "tsyringe"

import { pool } from "../db/pool.js"

@injectable()
export class UserRepository {
  create(email: string, password: string) {
    const query = `
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING email, created_at
    `
    const values = [email, password]

    return pool.query(query, values)
  }

  update_refresh_token(id: string, refresh_token: string) {
    const query = `
      UPDATE users
      SET refresh_token = $1
      WHERE id = $2
      RETURNING email, created_at, refresh_token
    `
    const values = [refresh_token, id]

    return pool.query(query, values)
  }

  update_password(id: string, password: string) {
    const query = `
      UPDATE users
      SET password = $1
      WHERE id = $2
      RETURNING email, created_at
    `
    const values = [password, id]

    return pool.query(query, values)
  }

  find_by_email(email: string) {
    const query = `
      SELECT id, email, password, created_at, is_verified
      FROM users
      WHERE email = $1
      LIMIT 1
    `
    const values = [email]

    return pool.query(query, values)
  }

  find_by_id(id: string) {
    const query = `
      SELECT id, email, password, created_at, is_verified
      FROM users
      WHERE id = $1
    `
    const values = [id]

    return pool.query(query, values)
  }
}
