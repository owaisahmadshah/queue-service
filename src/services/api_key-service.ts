import { inject, injectable } from "tsyringe"
import crypto from "node:crypto"

import { ApiKeyRepository } from "../repositories/api_key-repository.js"
import { ApiError } from "../utils/api-error.js"
import type { TCreateApiKey, TRevokeApiKey } from "../types/api_key-type.js"

@injectable()
export class ApiKeyService {
  private readonly PREFIX = "ntfy_"

  constructor(
    @inject(ApiKeyRepository) private api_key_repository: ApiKeyRepository
  ) {}

  async create({ name, user_id }: TCreateApiKey) {
    const entropy = crypto.randomBytes(32).toString("base64url")
    const raw_key = `${this.PREFIX}${entropy}`

    const key_hash = this.hash_key(raw_key)
    // Grab prefix + first 4 chars of entropy for the preview (e.g., ntfy_abcd)
    const key_preview = raw_key.substring(0, 9)

    await this.api_key_repository.create(user_id!, key_hash, key_preview, name)

    return raw_key
  }

  async get_user_keys(user_id: string) {
    const keys = await this.api_key_repository.get_keys_for_user(user_id)

    return keys.rows
  }

  async revoke_key({ key_id, user_id }: TRevokeApiKey) {
    const revoked_key = await this.api_key_repository.revoke_key(
      key_id!,
      user_id!
    )

    if (!revoked_key || !revoked_key.rows.length) {
      throw new ApiError(400, "Key not found")
    }

    return revoked_key
  }

  async validate(raw_key: string) {
    const incoming_hash = this.hash_key(raw_key)

    const results = await this.api_key_repository.find_by_hash(incoming_hash)
    const key_data = results.rows[0]

    if (!key_data || key_data.revoked_at) {
      throw new ApiError(401, "Invalid or revoked API key")
    }

    this.api_key_repository.update_last_used(incoming_hash).catch(console.error)

    return key_data.user_id
  }

  private hash_key(raw_key: string) {
    return crypto.createHash("sha256").update(raw_key).digest("hex")
  }
}
