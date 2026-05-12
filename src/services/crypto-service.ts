import { injectable } from "tsyringe"
import bcrypt from "bcrypt"
import crypto from "node:crypto"
import type { TIdempotencyPayload } from "../types/idempotency_payload-type.js"

@injectable()
export class CryptoService {
  async hash_password(password: string, salt_or_rounds?: number) {
    return await bcrypt.hash(password, salt_or_rounds ?? 10)
  }

  async compare_passwords(plain: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed)
  }

  generate_api_key(PREFIX: string) {
    const entropy = crypto.randomBytes(32).toString("base64url")
    const raw_key = `${PREFIX}${entropy}`

    const key_hash = this.hash_api_key(raw_key)
    const key_preview = raw_key.substring(0, 9)

    return { key_hash, key_preview, raw_key }
  }

  hash_api_key(raw_key: string) {
    return crypto.createHash("sha256").update(raw_key).digest("hex")
  }

  gen_idempotency_key_fingerprint(data: TIdempotencyPayload): string {
    const ordered = Object.keys(data)
      .sort()
      .reduce((obj: any, key: string) => {
        obj[key] = (data as any)[key]
        return obj
      }, {})

    return crypto
      .createHash("sha256")
      .update(JSON.stringify(ordered))
      .digest("hex")
  }
}
