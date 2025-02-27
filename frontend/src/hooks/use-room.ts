import { errorToast, successToast } from '@/lib/toast'
import { PbId } from '@/schemas/pb-schema'
import { RoomExpanded, roomExpandedSchema } from '@/schemas/room.schema'
import { Vote, voteSchema } from '@/schemas/votes.schema'
import {
  ExpandedRoomResponse,
  joinRoom as joinRoomApi,
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
import { toast } from 'sonner'

export default function useVotingRoom() {
  const { roomId } = useParams({ from: '/rooms/$roomId' })

  const queryClient = useQueryClient()
  const { data: room } = useSuspenseQuery(roomQueryOptions(roomId))

  useEffect(() => {
    pb.collection('rooms').subscribe<ExpandedRoomResponse>(
      roomId,
      (e) => {
        const displayResults = e.record.displayResults
        const isActive = e.record.isActive

        if (!room.activeStory?.id) return

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
      console.log(data.action, 'the action')
      console.log(data.record, 'the record')

      // TODO handle deletes
      if (data.action === 'delete') return

      const newVote = voteSchema.parse(data.record)

      console.log('setting query data', room.id)
      queryClient.setQueryData<unknown, string[], RoomExpanded>(
        ['room', room.id],
        (old) => {
          if (old && old.votes) {
            return { ...old, votes: [...old.votes, newVote] }
          }
          if (old) {
            return { ...old, votes: [newVote] }
          }
        }
      )
      const queryData = queryClient.getQueriesData({
        queryKey: ['room', room.id]
      })
      console.log(queryData, 'query data')
    })

    return () => {
      pb.collection('votes').unsubscribe('*')
    }
  }, [roomId])

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

  const joinRoomMutation = useMutation({
    mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
      joinRoomApi(roomId, userId),
    onSuccess: () => toast.success('Welcome!'),
    onError: (error) => errorToast('oops', error),
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

  const isUserJoined = (userId: PbId): boolean => {
    return room.members.find((m) => m.id === userId) ? true : false
  }

  const joinRoom = (roomId: PbId, userId: PbId) =>
    joinRoomMutation.mutate({ roomId, userId })

  return {
    room,
    addVote,
    displayResults,
    isUserJoined,
    joinRoom
  }
}
