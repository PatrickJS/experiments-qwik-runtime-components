import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;
const ROOT = path.join(__dirname, "..");
const pkg = await fs
  .readFile(path.join(ROOT, "./package.json"), "utf-8")
  .then((str) => JSON.parse(str));
console.log("pkg", pkg);
const mainFile = path.join(ROOT, pkg.main);
const mainDir = path.dirname(mainFile);
const typesFile = path.join(ROOT, pkg.types);
const typeFileName = path.relative(mainDir, pkg.types);

const app = new Hono();

console.log("ROOT", ROOT);

const index = async () => {
  const script = await fs.readFile(mainFile, "utf8");
  return new Response(script, {
    status: 201,
    headers: {
      "X-TypeScript-Types": `/${typeFileName}`,
      "Content-Type": "application/javascript",
    },
  });
};

const indexType = async () => {
  const script = await fs.readFile(typesFile, "utf8");
  return new Response(script, {
    status: 201,
    headers: {
      "Content-Type": "application/typescript",
    },
  });
};

const components = await fs.readdir(path.join(ROOT, "./src/components"));
console.log("components", components);
app.get(`/meta`, () => {
  // get a list of all the components
  return new Response(
    JSON.stringify(
      {
        types: "index.qwik.d.ts",
        main: "index.qwik.mjs",
        qwik: "index.qwik.mjs",
        exports: components.map((component) => component.replace(/\.tsx?/, "")),
      },
      null,
      2
    ),
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
});
components.forEach((component) => {
  app.get(`/${component}`, index);
  app.get(`/${component.replace(/\.tsx?/, "")}`, index);
  const dts = component.replace(/\.tsx?/, ".d.ts");
  app.get(`/${dts}`, async () => {
    const cmpTypes = await fs.readFile(
      path.join(ROOT, `./dist/components/${dts}`),
      "utf8"
    );
    return new Response(cmpTypes, {
      status: 201,
      headers: {
        "Content-Type": "application/typescript",
      },
    });
  });
});

app.get("/index.qwik.mjs", index);
app.get("/index.qwik.d.ts", indexType);
app.get("/.d.ts", indexType);
app.get("/", index);
app.get("/.js", index);
app.get("/.mjs", index);
app.get("/package.json", () => {
  const strPkg = JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      main: pkg.main,
      types: pkg.types,
      exports: pkg.exports,
      // type: "module"
      type: pkg.type,
    },
    null,
    2
    // remove dist from the exports
  ).replaceAll("./dist/", "./");
  return new Response(strPkg, {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
});

app.use("*", serveStatic({ root: "./dist" }));

serve({
  fetch: app.fetch,
  port: PORT,
});
console.log(`Server running at ${PORT}`);
