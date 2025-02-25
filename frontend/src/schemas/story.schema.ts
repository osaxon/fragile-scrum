import { z } from 'zod'
import { pbIdSchema } from './pb-schema'

export const storySchema = z.object({
  id: pbIdSchema.optional(),
  name: z.string(),
  room: pbIdSchema
})

export const storyListSchema = z.array(storySchema)
export type Story = z.infer<typeof storySchema>
