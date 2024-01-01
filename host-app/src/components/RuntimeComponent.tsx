import {
  component$,
  Resource,
  useOnWindow,
  useResource$,
  useSignal,
  $,
} from "@builder.io/qwik";

export const RuntimeComponent = component$(
  ({ name, clientOnly, fallback, base = "", ...props }) => {
    const csr = useSignal(false);
    useOnWindow(
      "DOMContentLoaded",
      $(() => {
        csr.value = true;
      })
    );
    const remoteCmp = useResource$(async ({ track }) => {
      track(() => csr.value);
      if (clientOnly === true && csr.value === false) {
        return;
      } else if ((clientOnly === true && csr.value) === true) {
        // fake loading
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      const hostElement = "div";
      const attrs: any = [];
      // add track if you want the component to be different on the client
      const config = `?tagName=${hostElement}&attributes=${attrs.join(",")}`;
      // send outerHTML to replace
      // get URL from config
      // can get default config from fetch or window.config etc
      const res = await fetch(
        `${base}${base.endsWith("/") ? "" : "/"}${name}${config}`
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
