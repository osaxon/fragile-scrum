import useRoom from '@/hooks/use-room'

export default function RoomPage() {
  const { room } = useRoom()

  return <div>{JSON.stringify({ room })}</div>
}
