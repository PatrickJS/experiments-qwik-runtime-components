import {
  component$,
  Resource,
  useOnWindow,
  useResource$,
  useSignal,
  $,
  useContext,
  createContextId,
} from "@builder.io/qwik";

export const RuntimeContext = createContextId<{ origin: string }>(
  "RuntimeContext"
);

export const RuntimeComponent = component$(
  ({ name, clientOnly, fallback, origin = "", ...props }) => {
    const contextConfig = useContext(RuntimeContext);
    const originUrl = contextConfig.origin || origin;
    const csr = useSignal(false);
    useOnWindow(
      "DOMContentLoaded",
      $(() => {
        csr.value = true;
      })
    );
    const remoteCmp = useResource$(async ({ track }) => {
      if (clientOnly === true && csr.value === false) {
        track(() => csr.value);
        return;
      } else if ((clientOnly === true && csr.value) === true) {
        // fake loading
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      const hostElement = "div";
      const attrs: any = [];
      // add track if you want the component to be different on the client
      const config = `?component=${name}&tagName=${hostElement}&attributes=${attrs.join(
        ","
      )}`;
      // send outerHTML to replace
      // get URL from config
      // can get default config from fetch or window.config etc
      const res = await fetch(
        `${originUrl}${originUrl.endsWith("/") ? "" : "/"}${config}`
      );
      // cache response
      const html = await res.text();
      return html;
    });
    return clientOnly === true && fallback && csr.value === false ? (
      fallback
    ) : (
      <Resource
        value={remoteCmp}
        onResolved={(html) => (
          /* need outerHTML */ <div dangerouslySetInnerHTML={html} {...props} />
        )}
      />
    );
  }
);
