import { PbId } from '@/schemas/pb-schema'
import { queryOptions } from '@tanstack/react-query'
import { Room, roomListSchema, roomSchema } from '../schemas/room-schema'
import { pb } from './pocketbase'

export async function getAllRooms() {
  const rooms = await pb.collection('rooms').getFullList()
  return roomListSchema.parse(rooms)
}

export async function getRoomById(roomId: PbId) {
  const room = await pb.collection('rooms').getOne(roomId)
  return roomSchema.parse(room)
}

export async function createRoom(data: Room) {
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
