import { z } from 'zod'
import { pbIdSchema } from './pb-schema'
import { roomMemberSchema } from './room.schema'

export const scoresSchema = z
  .object({
    id: pbIdSchema.optional(),
    expand: z.object({
      user: roomMemberSchema
    }),
    story: pbIdSchema,
    latestScore: z.number(),
    totalVotes: z.number()
  })
  .transform(({ expand, ...rest }) => ({
    ...rest,
    user: expand.user?.username
  }))

export const scoresListSchema = z.array(scoresSchema)

export type Scores = z.infer<typeof scoresSchema>
