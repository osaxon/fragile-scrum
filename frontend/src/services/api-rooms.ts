import { PbId } from '@/schemas/pb-schema'
import { Story } from '@/schemas/story.schema'
import { RoomsResponse } from '@/types/pocketbase-types'
import { queryOptions } from '@tanstack/react-query'
import {
  roomExpandedSchema,
  RoomInsertModel,
  roomListSchema,
  RoomMembers
} from '../schemas/room.schema'
import { pb } from './pocketbase'

export type ExpandedRoomResponse = RoomsResponse<{
  members: RoomMembers
  activeStory: Story
  stories_via_room: Story[]
}>

export async function getAllRooms() {
  const rooms = await pb.collection('rooms').getFullList()
  return roomListSchema.parse(rooms)
}

export async function getRoomById(roomId: PbId) {
  const room = await pb
    .collection('rooms')
    .getOne<ExpandedRoomResponse>(roomId, {
      expand:
        'members, activeStory.votes_via_story, stories_via_room, stories_via_room.votes_via_story'
    })

  return roomExpandedSchema.parse(room)
}

export async function createRoom(data: RoomInsertModel) {
  return pb.collection('rooms').create(data)
}

export async function setDisplayResults(roomId: PbId, current: boolean) {
  return pb.collection('rooms').update(roomId, { displayResults: !current })
}

export async function joinRoom(roomId: PbId, userId: PbId) {
  return pb.collection('rooms').update(roomId, {
    'members+': userId
  })
}

export async function setActiveStory(roomId: PbId, storyId: PbId) {
  return pb.collection('rooms').update(roomId, {
    activeStory: storyId
  })
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
    select: (data) => {
      return {
        ...data,
        votes: data.votes?.sort((a, b) => (a.created! < b.created! ? 1 : -1))
      }
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000
  })
