import { errorToast, successToast } from '@/lib/toast'
import { Room } from '@/schemas/room-schema'
import {
  createRoom as createRoomApi,
  roomsQueryOptions
} from '@/services/api-rooms'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

export default function useRooms() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: rooms } = useSuspenseQuery(roomsQueryOptions)

  const createMutatation = useMutation({
    mutationFn: ({ data }: { data: Room }) => createRoomApi(data),
    onSuccess: (_, context) => {
      successToast(
        'New room created',
        `A new room "${context.data.name}" was created.`
      )
      navigate({ to: '/rooms' })
    },
    onError: (error) => {
      console.error(error)
      errorToast('Could not create the room', error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    }
  })

  const createRoom = (roomData: Room) =>
    createMutatation.mutate({ data: roomData })

  return {
    rooms,
    createRoom
  }
}
