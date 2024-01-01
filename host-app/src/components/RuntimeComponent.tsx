import {
  component$,
  Resource,
  useOnWindow,
  useResource$,
  useSignal,
  $,
} from "@builder.io/qwik";

export const RuntimeComponent = component$(
  ({ name, clientOnly, fallback, base = "" }) => {
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
      // add track if you want the component to be different on the client
      const config = `?tagName=section&attributes=my-custom-attr=my-value,other-atr=otherValue`;
      // send outerHTML to replace
      // get URL from config
      // can get default config from fetch or window.config etc
      const res = await fetch(
        `${base}${base.endsWith("/") ? "" : "/"}${name}${config}`
      );
      // cache response
      const text = await res.text();
      return text;
    });
    return clientOnly === true && fallback && csr.value === false ? (
      fallback
    ) : (
      <Resource
        value={remoteCmp}
        onResolved={(text) => (
          /* need outerHTML */ <div dangerouslySetInnerHTML={text} />
        )}
      />
    );
  }
);
