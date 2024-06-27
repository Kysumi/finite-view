import { initTRPC } from '@trpc/server';
import { tableRouter } from './routes/table';

const t = initTRPC.create({ isServer: true });

export const router = t.router({
  table: tableRouter
});

export type AppRouter = typeof router;
