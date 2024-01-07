import {
  component$,
  useContextProvider,
  useServerData,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  RuntimeComponent,
  RuntimeContext,
} from "~/components/RuntimeComponent";
import { ComponentA } from "@remotes/remote-components";

export default component$(() => {
  const serverData = useServerData<string[]>("SERVER_DATA", [{
    {
      _id: '-some-id-number-0-',
      name: "ComponentA",
    }
  ]);
  useContextProvider(RuntimeContext, {
    origin: "http://localhost:4173",
  });
  return (
    <>
      <div>Hello World</div>
      <div>Components Available</div>
      <hr />
      <p>list of remote container components from SSR data</p>
      {serverData.map((config) => (
        <RuntimeComponent key={config.id} name={config.name} />
      ))}

      <hr />
      <p>hardcoded remote components that are grabbed at build-time</p>
      <div>HELLO</div>
      <ComponentA text="remote import type">
        <div>HELLO inside componentA</div>
      </ComponentA>

      <hr />
      <p>list of hardcoded remote container components</p>
      <RuntimeComponent name="ComponentA" />
      <RuntimeComponent name="ComponentB" />
      <RuntimeComponent name="ComponentC" />

      <hr />
      <p>client only container components</p>
      <RuntimeComponent
        name="ComponentC"
        fakeLoading={true}
        fallback={<div>Loading...</div>}
        clientOnly={true}
      />
      <RuntimeComponent
        name="ComponentD"
        fakeLoading={true}
        fallback={<div>Loading...</div>}
        clientOnly={true}
        onClick$={() => console.log("clicked host listener only")}
      />
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
