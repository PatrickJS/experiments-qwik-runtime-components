import {
  component$,
  Resource,
  useOnWindow,
  useResource$,
  useSignal,
  $,
  useContext,
  createContextId,
  useVisibleTask$,
} from "@builder.io/qwik";

import { isBrowser, isServer } from "@builder.io/qwik/build";

export const RuntimeContext = createContextId<{ origin: string }>(
  "RuntimeContext"
);

// batch fetches based on 10ms
let cache: Cache | null = null;

async function getCache(url: string) {
  if (isServer) {
    return null;
  }
  if (cache === null) {
    cache = await window.caches.open("remote-container-components");
  }
  const res = await cache.match(url);
  if (res) {
    return res as Response;
  }
  return null;
}

async function cacheFetch(url: string, fakeLoading = false) {
  if (isBrowser) {
    if (cache === null) {
      cache = await window.caches.open("remote-container-components");
    }
    const res = await cache.match(url);
    if (res) {
      return res;
    }
  }
  const res = await fetch(url);
  if (fakeLoading) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  if (isBrowser && cache) {
    await cache.put(url, res.clone());
  }
  return res;
}

export const RuntimeComponent = component$(
  ({ name, clientOnly, fallback, origin = "", fakeLoading, ...props }) => {
    const contextConfig = useContext(RuntimeContext);
    const originUrl = contextConfig.origin || origin;
    const csr = useSignal(false);
    const hostElement = "div";
    const attrs: any = [];
    // add track if you want the component to be different on the client
    const config = `?component=${name}&tagName=${hostElement}&attributes=${attrs.join(
      ","
    )}`;
    const url = `${originUrl}${originUrl.endsWith("/") ? "" : "/"}${config}`;

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      csr.value = true;
    });

    const remoteCmp = useResource$(async ({ track }) => {
      track(() => clientOnly);
      if (clientOnly === true) {
        track(() => csr.value);
        const cache = await getCache(url);
        if (cache !== null) {
          return await cache.text();
        }
        if (csr.value === false) return;
      }
      // send outerHTML to replace
      // get URL from config
      // can get default config from fetch or window.config etc
      const res = await cacheFetch(url, fakeLoading);
      // cache response
      const html = await res.text();
      return html;
    });
    return (
      <Resource
        value={remoteCmp}
        onPending={() => fallback}
        onResolved={(html) =>
          /* need outerHTML */ !html ? (
            fallback
          ) : (
            <div dangerouslySetInnerHTML={html} {...props} />
          )
        }
      />
    );
  }
);
