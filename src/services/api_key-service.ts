import { inject, injectable } from "tsyringe"

import { ApiKeyRepository } from "../repositories/api_key-repository.js"
import { ApiError } from "../utils/api-error.js"
import type { TCreateApiKey, TRevokeApiKey } from "../types/api_key-type.js"
import { CryptoService } from "./crypto-service.js"

@injectable()
export class ApiKeyService {
  private readonly PREFIX = "ntfy_"

  constructor(
    @inject(ApiKeyRepository) private api_key_repository: ApiKeyRepository,
    @inject(CryptoService) private crypto_service: CryptoService
  ) {}

  async create({ name, user_id }: TCreateApiKey) {
    const { key_hash, key_preview, raw_key } =
      this.crypto_service.generate_api_key(this.PREFIX)

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
    const incoming_hash = this.crypto_service.hash_api_key(raw_key)

    const results = await this.api_key_repository.find_by_hash(incoming_hash)
    const key_data = results.rows[0]

    if (!key_data || key_data.revoked_at) {
      throw new ApiError(401, "Invalid or revoked API key")
    }

    this.api_key_repository.update_last_used(incoming_hash).catch(console.error)

    return key_data.user_id
  }
}
