import { env } from "node:process"

const is_production = env.NODE_ENV === "PRODUCTION"

const cookie_base = {
  httpOnly: true,
  secure: is_production,
  sameSite: (is_production ? "none" : "lax") as "none" | "lax",
}

export const access_token_cookie_options = {
  ...cookie_base,
  maxAge: 50 * 60 * 1000,
}

export const refresh_token_cookie_options = {
  ...cookie_base,
  maxAge: 25 * 24 * 60 * 60 * 1000,
}
