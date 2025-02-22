import { z } from 'zod'
import { pbIdSchema } from './pb-schema'

export const roomSchema = z.object({
  id: pbIdSchema.optional(),
  name: z.string(),
  user: pbIdSchema,
  members: z.array(z.string())
})

export const roomListSchema = z.array(roomSchema)
export type Room = z.infer<typeof roomSchema>
