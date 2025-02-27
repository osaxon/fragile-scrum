import { z } from 'zod'
import { pbIdSchema } from './pb-schema'
import { voteSchema } from './votes.schema'

export const storySchema = z.object({
  id: pbIdSchema.optional(),
  name: z.string(),
  room: pbIdSchema
})

export const storyWithVotesSchema = storySchema.extend({
  expand: z.object({
    votes_via_story: z.array(voteSchema).optional()
  })
})

export const storyListSchema = z.array(storySchema)
export type Story = z.infer<typeof storySchema>

export const storyWithVotesListSchema = z.array(storyWithVotesSchema)
export type StoryWithVotes = z.infer<typeof storyWithVotesSchema>

export const storyMetricsSchema = z.object({
  id: pbIdSchema,
  name: z.string(),
  totalVotes: z.number(),
  avgScore: z.number(),
  totalVoters: z.number()
})

export const storyMetricsListSchema = z.array(storyMetricsSchema)
export type StoryMetrics = z.infer<typeof storyMetricsSchema>
