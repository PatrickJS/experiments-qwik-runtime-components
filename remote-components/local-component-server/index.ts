import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
const PORT = 3000;

const app = new Hono();

app.use("*", serveStatic({ root: "./dist" }));
app.get("/", (c) => c.text("Hello Node.js!"));

serve({
  fetch: app.fetch,
  port: PORT,
});
console.log(`Server running at ${PORT}`);
