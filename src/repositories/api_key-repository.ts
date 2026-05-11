import { injectable } from "tsyringe"
import { pool } from "../db/pool.js"

@injectable()
export class ApiKeyRepository {
  create(
    user_id: string,
    key_hash: string,
    key_preview: string,
    name?: string
  ) {
    const query = `
      INSERT INTO api_keys (user_id, key_hash, key_preview, name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, key_preview, created_at
    `

    const values = [user_id, key_hash, key_preview, name]

    return pool.query(query, values)
  }

  revoke_key(key_id: string, user_id: string) {
    const query = `
      UPDATE api_keys
      SET revoked_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `

    return pool.query(query, [key_id, user_id])
  }

  get_keys_for_user(user_id: string) {
    const query = `
      SELECT id, key_preview, name, created_at, last_used_at
      FROM api_keys
      WHERE user_id = $1 AND revoked_at IS NULL
    `

    return pool.query(query, [user_id])
  }

  find_by_hash(key_hash: string) {
    const query = `
      SELECT user_id, revoked_at 
      FROM api_keys 
      WHERE key_hash = $1
      LIMIT 1
    `
    return pool.query(query, [key_hash])
  }

  update_last_used(key_hash: string) {
    const query = `
      UPDATE api_keys 
      SET last_used_at = CURRENT_TIMESTAMP 
      WHERE key_hash = $1
    `
    return pool.query(query, [key_hash])
  }
}
