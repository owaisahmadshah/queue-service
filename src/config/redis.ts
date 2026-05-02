import { Redis } from "ioredis"

const REDIS_PORT: number = Number(process.env.REDIS_PORT)
const REDIS_HOST: string = process.env.REDIS_HOST!

export const redis_connection = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  maxRetriesPerRequest: null,
})
