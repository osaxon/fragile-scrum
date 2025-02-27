import { getScoreMetrics, getStoryMetrics } from '@/services/api-stories'
import { useSuspenseQueries } from '@tanstack/react-query'

export default function useStoryMetrics({ storyId }: { storyId: string }) {
  const metrics = useSuspenseQueries({
    queries: [
      {
        queryKey: ['story-metrics', storyId],
        queryFn: () => getStoryMetrics(storyId)
      },
      {
        queryKey: ['score-metrics', storyId],
        queryFn: () => getScoreMetrics(storyId)
      }
    ]
  })

  const [storyMetrics, scoreMetrics] = metrics

  return {
    storyMetrics: storyMetrics.data,
    scoreMetrics: scoreMetrics.data
  }
}
