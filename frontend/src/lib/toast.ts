import { toast } from 'sonner'

export function successToast(title: string, message: string = '') {
  toast.success(title, {
    description: message,
    classNames: {
      toast: 'bg-card text-muted-foreground',
      title: 'text-foreground',
      description: 'text-muted-foreground',
      icon: 'text-green-500',
      closeButton: 'right-1 top-1 left-auto !absolute scale-125 !bg-card'
    },
    closeButton: true
  })
}

export function errorToast(title: string, messageData?: unknown) {
  let messageText = ''
  if (messageData instanceof Error)
    messageText = messageData.message || 'Unknown error'
  if (typeof messageData === 'string') messageText = messageData
  toast.error(title, {
    description: messageText,
    classNames: {
      toast: 'bg-card text-muted-foreground',
      title: 'text-foreground',
      description: 'text-muted-foreground',
      icon: 'text-destructive',
      closeButton: 'right-1 top-1 left-auto !absolute scale-125 !bg-card'
    },
    closeButton: true
  })
}
