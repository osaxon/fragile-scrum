import { PbId } from '@/schemas/pb-schema'
import { RoomsResponse } from '@/types/pocketbase-types'
import { queryOptions } from '@tanstack/react-query'
import {
  RoomInsertModel,
  roomListSchema,
  RoomMembers,
  roomWithMembersSchema
} from '../schemas/room.schema'
import { pb } from './pocketbase'

async function asyncMap<T, R>(
  iterable: T[],
  asyncTransform: (a: T) => Promise<R>
): Promise<R[]> {
  const promises: Promise<R>[] = iterable.map(asyncTransform)
  return Promise.all(promises)
}

export async function getAllRooms() {
  const rooms = await pb.collection('rooms').getFullList()
  console.log(rooms, 'the rooms')
  return roomListSchema.parse(rooms)
}

export async function getRoomById(roomId: PbId) {
  const room = await pb
    .collection('rooms')
    .getOne<RoomsResponse<{ members: RoomMembers }>>(roomId, {
      expand: 'votes_via_room.activeStory, members',
      fields:
        'id, name, user, activeStory, expand.members.id, expand.members.name, expand.members.avatar, expand.members.username'
    })
  const members = room.expand?.members ?? []
  const membersWithAvatars = await asyncMap(members, async (member) => {
    if (!member.avatar) return member

    try {
      const user = await pb.collection('users').getOne(member.id)
      return {
        ...member,
        avatar: pb.files.getURL(user, member.avatar, { thumb: '100x250' })
      }
    } catch (error) {
      console.error(`Failed to fetch user ${member.id}:`, error)
      return member
    }
  })

  const updatedRoom = {
    ...room,
    expand: {
      ...room.expand,
      members: membersWithAvatars
    }
  }

  return roomWithMembersSchema.parse(updatedRoom)
}

export async function createRoom(data: RoomInsertModel) {
  return pb.collection('rooms').create(data)
}

export const roomsQueryOptions = queryOptions({
  queryKey: ['rooms'],
  queryFn: () => getAllRooms(),
  staleTime: 30 * 1000,
  gcTime: 5 * 60 * 1000,
  refetchInterval: 5 * 60 * 1000
})

export const roomQueryOptions = (roomId: string) =>
  queryOptions({
    queryKey: ['room', roomId],
    queryFn: () => getRoomById(roomId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000
  })
