import { useState } from 'react';
import { ipcLink } from 'electron-trpc/renderer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@renderer/api';
import { Demo } from './page/Demo';
import { TableSelection } from './components/TableSelection';

function App(): JSX.Element {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [ipcLink()]
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TableSelection />
        <Demo />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
