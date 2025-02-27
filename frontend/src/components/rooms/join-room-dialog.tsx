import DrawerDialog from '../shared/drawer-dialog'

interface JoinRoomDialogProps {
  children: React.ReactNode
  isUserJoined: boolean
}

export default function JoinRoomDialog(props: JoinRoomDialogProps) {
  if (props.isUserJoined) return null
  return (
    <DrawerDialog open={!props.isUserJoined} title='Join Room'>
      {props.children}
    </DrawerDialog>
  )
}
