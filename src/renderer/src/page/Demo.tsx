import { trpc } from '@renderer/api'

export const Demo = () => {
  const { data } = trpc.greeting.useQuery({ name: 'Electron' })

  console.log(data)

  trpc.subscription.useSubscription(undefined, {
    onData: (data) => {
      console.log('YOOOOOOO- Client', data)
    }
  })

  return (
    <div>
      <h1>Demo</h1>
      <p>This is a demo page.</p>
    </div>
  )
}
