import { useState } from 'react';
import { ipcLink } from 'electron-trpc/renderer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@renderer/api';
import { TableSelection } from './components/TableSelection';
import { QueryFilters } from '@renderer/components/QueryFilters';

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [ipcLink()]
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col gap-4 p-4">
          <TableSelection />
          <QueryFilters />
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
