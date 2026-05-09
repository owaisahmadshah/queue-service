import z from "zod"

export const create_user_schema = z.object({
  email: z.string().min(1, "Email required"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
})

export const sign_user_schema = create_user_schema

export const update_password_schema = z.object({
  id: z.string().optional(),
  old_password: z
    .string()
    .min(8, "Password must contain at least 8 characters"),
  new_password: z
    .string()
    .min(8, "Password must contain at least 8 characters"),
})

export type TCreateUser = z.infer<typeof create_user_schema>
export type TSignInUser = z.infer<typeof sign_user_schema>
export type TUpdatePassword = z.infer<typeof update_password_schema>

export type TUser = {
  id: string
  email: string
  created_at: string
}

// For API routes
export const create_user_request_schema = z.object({
  body: create_user_schema,
})

export const sign_in_user_request_schema = z.object({
  body: sign_user_schema,
})

export const update_password_request_schema = z.object({
  body: update_password_schema,
})
