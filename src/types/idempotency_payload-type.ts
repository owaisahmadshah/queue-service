export type TIdempotencyPayload = {
  channel: string
  payload: Record<string, any>
  priority: number
  scheduled_at: string | Date | null
}
