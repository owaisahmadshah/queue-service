import z from "zod"

export const create_api_key_schema = z.object({
  user_id: z.string().optional(),
  name: z
    .string()
    .min(4, "Key name must contain atleast 4 characters")
    .optional(),
})

export const revoke_api_key_schema = z.object({
  user_id: z.string().optional(),
  key_id: z.string(),
})

export type TCreateApiKey = z.infer<typeof create_api_key_schema>
export type TRevokeApiKey = z.infer<typeof revoke_api_key_schema>

export const create_api_key_req_schema = z.object({
  body: create_api_key_schema,
})

export const revoke_api_key_req_schema = z.object({
  body: revoke_api_key_schema,
})
