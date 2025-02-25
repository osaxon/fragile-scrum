import { errorToast, successToast } from '@/lib/toast'
import { RoomInsertModel } from '@/schemas/room.schema'
import { Vote } from '@/schemas/votes.schema'
import {
  createRoom as createRoomApi,
  roomsQueryOptions
} from '@/services/api-rooms'
import { createVote as createVoteApi } from '@/services/api.votes'
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
    mutationFn: ({ data }: { data: RoomInsertModel }) => createRoomApi(data),
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

  const createVoteMutation = useMutation({
    mutationFn: (voteData: Vote) => createVoteApi(voteData),
    onSuccess: () => successToast('Vote added'),
    onError: () => errorToast('Something went wrong!'),
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ['votes', data?.story] })
    }
  })

  const addVote = (vote: Vote) => createVoteMutation.mutate(vote)

  const createRoom = (roomData: RoomInsertModel) =>
    createMutatation.mutate({ data: roomData })

  return {
    rooms,
    createRoom,
    addVote
  }
}
