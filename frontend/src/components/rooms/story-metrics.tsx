import FormatJSON from '@/components/ui/form-json'
import useStoryMetrics from '@/hooks/use-story-metrics'

export default function StoryMetrics({ storyId }: { storyId: string }) {
  const { scoreMetrics, storyMetrics } = useStoryMetrics({ storyId })
  return (
    <div>
      <FormatJSON data={storyMetrics} />
      <FormatJSON data={scoreMetrics} />
    </div>
  )
}
