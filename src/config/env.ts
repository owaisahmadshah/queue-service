import { z } from "zod"

const envSchema = z.object({
  PORT: z.string().transform(Number).default(3000),
  REDIS_PORT: z.string().transform(Number).default(6379),
  POSTGRES_PORT: z.string().transform(Number).default(5432),
  REDIS_HOST: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_DATABASE: z.string(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format())
  process.exit(1)
}

export const env = parsed.data
