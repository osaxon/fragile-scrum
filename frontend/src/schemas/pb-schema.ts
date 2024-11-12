import { z } from 'zod'

export const pbIdSchema = z.string().regex(/^[a-z0-9]{15}$/)
export type PbId = z.infer<typeof pbIdSchema>
