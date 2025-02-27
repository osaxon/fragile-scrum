import { z } from 'zod'
import { pbIdSchema } from './pb-schema'
import { storySchema, storyWithVotesSchema } from './story.schema'

export const roomSchema = z.object({
  id: pbIdSchema,
  name: z.string(),
  user: pbIdSchema,
  displayResults: z.boolean(),
  isActive: z.boolean(),
  activeStory: z.string().optional()
})

export const roomMemberSchema = z.object({
  id: pbIdSchema,
  name: z.string(),
  username: z.string(),
  avatar: z.string()
})

export const roomMembersSchema = z.array(roomMemberSchema)

export const roomExpandedSchema = roomSchema
  .omit({ activeStory: true })
  .extend({
    expand: z.object({
      members: roomMembersSchema,
      activeStory: storyWithVotesSchema,
      stories_via_room: z.array(storySchema).optional()
    })
  })
  .transform(({ expand, ...rest }) => ({
    ...rest,
    members: expand?.members,
    activeStory: expand?.activeStory,
    stories: expand?.stories_via_room,
    votes: expand?.activeStory?.expand?.votes_via_story
  }))

export const roomListSchema = z.array(roomSchema)
export const roomExpandedListSchema = z.array(roomExpandedSchema)

export const insertRoomSchema = roomSchema.omit({ id: true, activeStory: true })

export type RoomMembers = z.infer<typeof roomMembersSchema>
export type RoomSelectModel = z.infer<typeof roomSchema>
export type RoomInsertModel = z.infer<typeof insertRoomSchema>

export type RoomWithMembers = z.infer<typeof roomExpandedListSchema>

export type RoomExpanded = z.infer<typeof roomExpandedSchema>
