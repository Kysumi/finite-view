import { useState } from "react";
import { ipcLink } from "electron-trpc/renderer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@renderer/api";

import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { InfiniteView } from "@renderer/pages/InfiniteView";
import { WelcomeRoute } from "@renderer/pages/Welcome";
import { GettingStarted } from "@renderer/pages/GettingStarted";
import { Button } from "@renderer/components/ui/button";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className={"bg-amber-600"}>
        ROOT <Outlet />
      </div>
    ),
    ErrorBoundary: () => (
      <div>
        Something went wrong
        <Link to={"/"}>
          <Button>Retry</Button>
        </Link>
      </div>
    ),
    // loader: rootLoader,
    children: [
      {
        path: "/",
        element: <WelcomeRoute />,
        // loader: teamLoader,
      },
      {
        path: "finite-view",
        element: <InfiniteView />,
        // loader: teamLoader,
      },
      {
        path: "getting-started",
        element: <GettingStarted />,
        // loader: teamLoader,
      },
    ],
  },
]);

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [ipcLink()],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
