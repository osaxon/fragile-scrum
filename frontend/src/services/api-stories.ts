import { PbId } from '@/schemas/pb-schema'
import { scoresListSchema } from '@/schemas/scores.schema'
import { storyMetricsListSchema, storySchema } from '@/schemas/story.schema'
import { pb } from './pocketbase'

export async function getStoryById(storyId: PbId) {
  const story = await pb.collection('stories').getOne(storyId)

  return storySchema.parse(story)
}

export async function getStoryMetrics(storyId: PbId) {
  const metrics = await pb.collection('story_metrics').getFullList({
    filter: pb.filter('id = {:storyId}', { storyId })
  })

  return storyMetricsListSchema.parse(metrics)
}

export async function getScoreMetrics(storyId: PbId) {
  const metrics = await pb.collection('latest_scores').getFullList({
    expand: 'user',
    filter: pb.filter('story = {:storyId}', { storyId })
  })

  console.log(metrics)

  return scoresListSchema.parse(metrics)
}
