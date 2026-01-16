import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Versus API" });
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;

export const port = process.env.PORT || 3001;
