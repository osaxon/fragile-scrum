import { z } from 'zod'
import { pbIdSchema } from './pb-schema'
import { userSchema } from './user-schema'

export const voteSchema = z.object({
  id: pbIdSchema.optional(),
  user: pbIdSchema,
  story: pbIdSchema,
  created: z.coerce.date().optional(),
  score: z.number()
})

export const voteWithUserSchema = voteSchema.extend({
  expand: z
    .object({
      user: userSchema
    })
    .optional()
})

export const voteListSchema = z.array(voteSchema)
export const voteWithUserListSchema = z.array(voteWithUserSchema)

export type Vote = z.infer<typeof voteSchema>
export type VoteWithUser = z.infer<typeof voteWithUserSchema>
