import { Pool } from "pg"

import { env } from "../config/env.js"

export const pool = new Pool({
  user: env.POSTGRES_USER,
  host: env.POSTGRES_HOST,
  database: env.POSTGRES_DATABASE,
  password: env.POSTGRES_PASSWORD,
  port: env.POSTGRES_PORT,
})
