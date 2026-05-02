import { Redis } from "ioredis"
import { env } from "./env.js"

export const redis_connection = new Redis({
  port: env.REDIS_PORT,
  host: env.REDIS_HOST,
  maxRetriesPerRequest: null,
})
