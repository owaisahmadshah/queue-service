export type TIdempotencyPayload = {
  channel: string
  payload: Record<string, any>
  priority: number
  user_id: string
}
