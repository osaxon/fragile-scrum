import { errorToast, successToast } from '@/lib/toast'
import { RoomExpanded, roomExpandedSchema } from '@/schemas/room.schema'
import { Vote, voteSchema } from '@/schemas/votes.schema'
import {
  ExpandedRoomResponse,
  roomQueryOptions,
  setDisplayResults
} from '@/services/api-rooms'
import { createVote as createVoteApi } from '@/services/api.votes'
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

  useEffect(() => {
    pb.collection('rooms').subscribe<ExpandedRoomResponse>(
      roomId,
      (e) => {
        const members = e.record.members
        const activeStory = e.record.activeStory
        const displayResults = e.record.displayResults
        const isActive = e.record.isActive

        if (!room.activeStory?.id) return

        console.log({
          members,
          activeStory,
          displayResults
        })
        const parsedRecord = roomExpandedSchema.parse(e.record)

        queryClient.setQueryData<unknown, string[], RoomExpanded>(
          ['room', room.id],
          (old) =>
            old && {
              ...old,
              members: parsedRecord.members,
              activeStory: parsedRecord.activeStory,
              displayResults,
              isActive
            }
        )
      },
      {
        expand:
          'members, activeStory.votes_via_story, stories_via_room, stories_via_room.votes_via_story,'
      }
    )

    return () => {
      pb.collection('rooms').unsubscribe(roomId)
    }
  }, [roomId])

  useEffect(() => {
    pb.collection('votes').subscribe('*', (data) => {
      const newVote = voteSchema.parse(data.record)

      queryClient.setQueryData<unknown, string[], RoomExpanded>(
        ['room', room.id],
        (old) => old && old.votes && { ...old, votes: [...old.votes, newVote] }
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

  const displayResultsMutation = useMutation({
    mutationFn: ({ roomId, current }: { roomId: string; current: boolean }) =>
      setDisplayResults(roomId, current),
    onError: () => errorToast('Something went wrong!'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['room', roomId] })
    }
  })

  const addVote = (vote: Vote) => createVoteMutation.mutate(vote)
  const displayResults = (roomId: string, current: boolean) =>
    displayResultsMutation.mutate({
      roomId,
      current
    })

  return {
    room,
    votes: room.votes,
    addVote,
    members: room.members,
    displayResults
  }
}
