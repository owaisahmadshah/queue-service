import { injectable } from "tsyringe"

import { pool } from "../db/pool.js"

@injectable()
export class UserRepository {
  async create(email: string, password: string) {
    const query = `
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING email, created_at
    `
    const values = [email, password]

    const created_column = await pool.query(query, values)

    return created_column.rows[0]
  }

  async update_refresh_token(id: string, refresh_token: string) {
    const query = `
      UPDATE users
      SET refresh_token = $1
      WHERE id = $2
      RETURNING email, created_at, refresh_token
    `
    const values = [refresh_token, id]

    const result = await pool.query(query, values)

    return result.rows[0]
  }

  async update_password(id: string, password: string) {
    const query = `
      UPDATE users
      SET password = $1
      WHERE id = $2
      RETURNING email, created_at
    `
    const values = [password, id]

    const result = await pool.query(query, values)

    return result.rows[0]
  }

  async find_by_email(email: string) {
    const query = `
      SELECT id, email, password, created_at, is_verified
      FROM users
      WHERE email = $1
      LIMIT 1
    `
    const values = [email]

    const col = await pool.query(query, values)

    return col.rows[0] || null
  }

  async find_by_id(id: string) {
    const query = `
      SELECT id, email, password, created_at, is_verified
      FROM users
      WHERE id = $1
    `
    const values = [id]

    const col = await pool.query(query, values)

    return col.rows[0] || null
  }
}
