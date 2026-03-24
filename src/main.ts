import type { Env } from 'hono';
import { Hono } from 'hono'
import { RootHtml } from './Layout';
import { loadRoutes } from './router';

export const app = new Hono<{ Bindings: Env }>();

app.use('*', RootHtml);

loadRoutes(app);

export const fetchHandler = (req: Request) => app.fetch(req);

export default app
