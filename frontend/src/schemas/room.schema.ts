import { z } from 'zod'
import { pbIdSchema } from './pb-schema'

export const roomSchema = z.object({
  id: pbIdSchema,
  name: z.string(),
  user: pbIdSchema,
  activeStory: z.string().optional()
})

export const roomMembersSchema = z
  .array(
    z.object({
      id: pbIdSchema,
      name: z.string(),
      username: z.string(),
      avatar: z.string()
    })
  )
  .optional()

export const roomWithMembersSchema = roomSchema
  .extend({
    expand: z
      .object({
        members: roomMembersSchema
      })
      .optional()
  })
  .transform(({ expand, ...rest }) => ({ ...rest, ...expand }))

export const roomListSchema = z.array(roomSchema)
export const roomWithMembersListSchema = z.array(roomWithMembersSchema)

export const insertRoomSchema = roomSchema.omit({ id: true, activeStory: true })

export type RoomMembers = z.infer<typeof roomMembersSchema>
export type RoomSelectModel = z.infer<typeof roomSchema>
export type RoomInsertModel = z.infer<typeof insertRoomSchema>

export type RoomWithMembers = z.infer<typeof roomWithMembersListSchema>
