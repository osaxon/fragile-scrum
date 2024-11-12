import { z } from 'zod'
import { pbIdSchema } from './pb-schema'

export const settingsSchema = z.object({
  id: pbIdSchema,
  remindEmail: z.string().email('Invalid email'),
  remindByEmailEnabled: z.boolean()
})

export type Settings = z.infer<typeof settingsSchema>
