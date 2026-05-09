import { inject, injectable } from "tsyringe"
import bcrypt from "bcrypt"

import type {
  TCreateUser,
  TSignInUser,
  TUpdatePassword,
} from "../types/user-type.js"

import { UserRepository } from "../repositories/user-repository.js"
import { ApiError } from "../utils/api-error.js"
import { TokenService } from "./token-service.js"

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) private user_repository: UserRepository,
    @inject(TokenService) private token_service: TokenService
  ) {}

  async create_user(user_data: TCreateUser) {
    const existing_user = await this.user_repository.find_by_email(
      user_data.email
    )

    if (existing_user.rows.length === 1) {
      throw new ApiError(409, "User with this email already exists")
    }

    const hashed_password = await this.hash_password(user_data.password)

    const created_user = await this.user_repository.create(
      user_data.email,
      hashed_password
    )

    return created_user
  }

  async sign_in(user_data: TSignInUser) {
    const results = await this.user_repository.find_by_email(user_data.email)

    if (results.rows.length === 0) {
      throw new ApiError(404, "User not found")
    }

    const user = results.rows[0]

    if (!user.is_verified) {
      // TODO Resend OTP and redirect to otp-verification page
      throw new ApiError(403, "Account is not verified")
    }

    if (!(await this.is_password_correct(user.password, user_data.password))) {
      throw new ApiError(400, "Incorrect password")
    }

    const { access_token, refresh_token } =
      await this.gen_refresh_access_tokens(user.id, user.email)

    return { user, access_token, refresh_token }
  }

  async update_password(data: TUpdatePassword) {
    const results = await this.user_repository.find_by_id(data.id!)

    if (results.rows.length === 0) {
      throw new ApiError(404, "User not found")
    }

    const user = results.rows[0]

    if (!(await this.is_password_correct(user.password, data.old_password))) {
      throw new ApiError(400, "Incorrect password")
    }

    const hashed_password = await this.hash_password(data.new_password)

    const updated_user = await this.user_repository.update_password(
      user.id,
      hashed_password
    )

    return updated_user
  }

  async get_user(id: string) {
    const results = await this.user_repository.find_by_id(id)

    if (results.rows.length === 0) {
      throw new ApiError(404, "User not found")
    }

    return results.rows[0]
  }

  private async gen_refresh_access_tokens(id: string, email: string) {
    const refresh_token = this.token_service.gen_refresh_token(id, email)

    const access_token = this.token_service.gen_access_token(id, email)

    await this.user_repository.update_refresh_token(id, refresh_token)

    return { refresh_token, access_token }
  }

  private async hash_password(password: string, salt_or_rounds?: number) {
    return await bcrypt.hash(password, salt_or_rounds ?? 10)
  }

  private async is_password_correct(
    hashed_password: string,
    incomming_password: string
  ) {
    return await bcrypt.compare(incomming_password, hashed_password)
  }
}
