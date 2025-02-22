import { Room } from '@/schemas/room-schema'
import { roomQueryOptions } from '@/services/api-rooms'
import { pb } from '@/services/pocketbase'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useEffect } from 'react'

export default function useRoom() {
  const { roomId } = useParams({ from: '/rooms/$roomId' })
  const queryClient = useQueryClient()
  const { data: room } = useSuspenseQuery(roomQueryOptions(roomId))

  useEffect(() => {
    console.log('connecting...')
    pb.collection('rooms').subscribe(
      roomId,
      (e) => {
        console.log(e.action)

        const members = e.record.members
        console.log(members)

        console.log('updating query data')
        queryClient.setQueryData<unknown, string[], Room>(
          ['room', roomId],
          (old) =>
            old && {
              ...old,
              members: members
            }
        )
      }
      //   { expand: 'members' }
    )

    return () => {
      pb.collection('rooms').unsubscribe(roomId)
    }
  }, [roomId])

  return {
    room
  }
}
