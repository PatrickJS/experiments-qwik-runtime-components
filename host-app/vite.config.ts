import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import remotePlugin from "./plugins/remote.mjs";

export default defineConfig(() => {
  return {
    clearScreen: false,
    debug: true,
    plugins: [
      remotePlugin({
        origin: "http://localhost:3000/",
        importModule: "@remotes",
        packageName: "remote-components",
      }),
      qwikCity(),
      qwikVite(),
      tsconfigPaths(),
    ],
    dev: {
      headers: {
        "Cache-Control": "public, max-age=0",
      },
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
    server: {
      cors: true,
    },
  };
});
