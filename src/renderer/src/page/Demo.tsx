import { trpc } from '@renderer/api'
import { Button } from '@renderer/components/ui/button'

export const Demo = () => {
  trpc.greeting.useQuery({
    name: 'Electron'
  })

  trpc.subscription.useSubscription(undefined, {
    onData: (data) => {
      console.log('YOOOOOOO- Client', data)
    }
  })

  const send = trpc.test.useMutation()

  return (
    <div>
      <h1>Demo</h1>
      <p>This is a demo page.</p>

      <Button
        className="action"
        onClick={() =>
          send.mutate({
            name: '123'
          })
        }
      >
        <a target="_blank" rel="noreferrer">
          Send IPC
        </a>
      </Button>
    </div>
  )
}
