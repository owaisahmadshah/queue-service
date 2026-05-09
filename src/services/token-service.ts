import { injectable } from "tsyringe"
import jwt from "jsonwebtoken"

import { env } from "../config/env.js"

import {
  ACCESS_TOKEN_EXPIRY,
  REFESH_TOKEN_EXPIRY,
} from "../config/constants.js"

@injectable()
export class TokenService {
  gen_access_token(id: string, email: string): string {
    return jwt.sign({ id, email }, env.ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    })
  }

  gen_refresh_token(id: string, email: string): string {
    return jwt.sign({ id, email }, env.REFRESH_TOKEN_SECRET, {
      expiresIn: REFESH_TOKEN_EXPIRY,
    })
  }
}
