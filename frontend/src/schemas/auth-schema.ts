import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(2, 'Invalid email'),
  password: z.string().min(8, 'Invalid password')
})

export type LoginFields = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email'),
    name: z.string().min(2, 'Too short'),
    password: z.string().min(8, 'Too short'),
    passwordConfirm: z.string()
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match',
    path: ['passwordConfirm']
  })

export type RegisterFields = z.infer<typeof registerSchema>

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Invalid token')
})

export type VerifyEmailForm = z.infer<typeof verifyEmailSchema>
