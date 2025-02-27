import { z } from 'zod'
import { pbIdSchema } from './pb-schema'

export const themeSchema = z.enum(['system', 'light', 'dark'])

export type Theme = z.infer<typeof themeSchema>

export const settingsSchema = z.object({
  id: pbIdSchema,
  remindEmail: z.string().optional(),
  remindByEmailEnabled: z.coerce.boolean(),
  theme: themeSchema
})

export type Settings = z.infer<typeof settingsSchema>
