import { PbId } from '@/schemas/pb-schema'
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
