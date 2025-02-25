import { errorToast, successToast } from '@/lib/toast'
import { RoomSelectModel } from '@/schemas/room.schema'
import { Vote, voteSchema } from '@/schemas/votes.schema'
import { roomQueryOptions } from '@/services/api-rooms'
import {
  createVote as createVoteApi,
  votesByStoryQueryOptions
} from '@/services/api.votes'
import { pb } from '@/services/pocketbase'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useEffect } from 'react'

export default function useVotingRoom() {
  const { roomId } = useParams({ from: '/rooms/$roomId' })

  const queryClient = useQueryClient()
  const { data: room } = useSuspenseQuery(roomQueryOptions(roomId))
  const { data: votes } = useSuspenseQuery(
    votesByStoryQueryOptions(room.activeStory)
  )

  useEffect(() => {
    console.log('connecting...')
    pb.collection('rooms').subscribe(
      roomId,
      (e) => {
        console.log(e.action)

        const members = e.record.members
        const activeStory = e.record.activeStory

        if (!room.activeStory) return

        queryClient.setQueryData<unknown, string[], RoomSelectModel>(
          ['room', room.activeStory],
          (old) =>
            old && {
              ...old,
              members,
              activeStory
            }
        )
      },
      {
        expand: 'votes_via_room.activeStory',
        fields: 'id, name, user, activeStory, expand.members.name'
      }
    )

    return () => {
      pb.collection('rooms').unsubscribe(roomId)
    }
  }, [roomId])

  useEffect(() => {
    console.log('subscribg to votes')
    pb.collection('votes').subscribe('*', (data) => {
      console.log('votes updated')

      const newVote = voteSchema.parse(data.record)

      queryClient.setQueryData<unknown, string[], Vote[]>(
        ['votes', room.id],
        (old) => old && [...old, { ...newVote }]
      )
    })

    return () => {
      pb.collection('votes').unsubscribe('*')
    }
  }, [])

  const createVoteMutation = useMutation({
    mutationFn: (voteData: Vote) => createVoteApi(voteData),
    onSuccess: () => successToast('Vote added'),
    onError: () => errorToast('Something went wrong!'),
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ['votes', data?.story] })
    }
  })

  const addVote = (vote: Vote) => createVoteMutation.mutate(vote)

  return {
    room,
    votes,
    addVote,
    members: room.members
  }
}
