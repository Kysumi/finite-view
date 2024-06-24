import { useState } from 'react'
import Versions from './components/Versions'
import { Button } from './components/ui/button'
import { ipcLink } from 'electron-trpc/renderer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from '@renderer/api'
import { Demo } from './page/Demo'

function App(): JSX.Element {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [ipcLink()]
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="p-4 bg-slate-50">
          <p className="text-3xl font-bold underline">Hello world!</p>
          <Button className="action">
            <a target="_blank" rel="noreferrer">
              Send IPC
            </a>
          </Button>
        </div>

        <Demo />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App
