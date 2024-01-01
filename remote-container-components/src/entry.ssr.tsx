/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is rendered outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - npm run start
 * - npm run preview
 * - npm run build
 *
 */
import {
  renderToStream,
  type RenderToStreamOptions,
} from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";
import Root from "./root";

import * as components from "~/routes/components";

export default function (opts: RenderToStreamOptions) {
  const url = new URL(opts.serverData?.url || "/");
  const config = {
    tagName: url.searchParams.get("tagName") || "div",
    attributes: {} as { [key: string]: string },
    baseUrl: `${url.origin}/build/`,
  };
  for (const [key, value] of url.searchParams.entries()) {
    config.attributes[key as string] = value;
  }
  // console.log("url", url, config);
  const cmp = url.searchParams.get("component") as string;
  // @ts-ignore
  const Component = components[cmp] || Root;
  return renderToStream(<Component {...config.attributes} />, {
    manifest,
    ...opts,
    // Use container attributes to set attributes on the html tag.
    base: config.baseUrl,
    containerTagName: config.tagName,
    containerAttributes: {
      ...opts.containerAttributes,
      ...config.attributes,
    },
    qwikLoader: {
      include: "never",
    },
    serverData: {
      ...opts.serverData,
    },
  });
}
