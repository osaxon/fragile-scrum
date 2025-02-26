import { PbId } from '@/schemas/pb-schema'
import { Vote, voteListSchema } from '@/schemas/votes.schema'
import { queryOptions } from '@tanstack/react-query'
import { pb } from './pocketbase'

export async function getVotesByStoryId(storyId?: PbId) {
  const votes = await pb.collection('votes').getFullList({
    filter: pb.filter('story = {:storyId}', { storyId }),
    sort: '-created',
    expand: 'story, user'
  })

  return voteListSchema.parse(votes)
}

export async function getUsersVotes(userId: PbId, storyId: PbId) {
  const votes = await pb.collection('votes').getFullList({
    filter: pb.filter('story = {:storyId} && user = {:userId}', {
      storyId,
      userId
    })
  })
  return voteListSchema.parse(votes)
}

export async function createVote(voteData: Vote) {
  return pb.collection('votes').create(voteData)
}

export const votesByStoryQueryOptions = (storyId?: string) =>
  queryOptions({
    queryKey: ['votes', storyId],
    queryFn: () => getVotesByStoryId(storyId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000
  })

export const usersVotesQueryOptions = (storyId: string, userId: string) =>
  queryOptions({
    queryKey: ['votes', storyId, userId],
    queryFn: () => getUsersVotes(userId, storyId)
  })
