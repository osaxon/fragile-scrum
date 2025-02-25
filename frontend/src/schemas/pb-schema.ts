import { z } from 'zod'

export const pbIdSchema = z.string().regex(/^[a-z0-9]{15}$/)
export type PbId = z.infer<typeof pbIdSchema>

export const pbTokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{2,}(?:\.[A-Za-z0-9_-]{2,}){2}$/, 'Invalid token')

export const pbRecord = z.object({
  id: pbIdSchema.optional(),
  created: z.coerce.date().optional()
})
