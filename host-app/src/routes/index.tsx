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

export default component$(() => {
  const serverData = useServerData<string[]>("SERVER_DATA", ["ComponentA"]);
  useContextProvider(RuntimeContext, {
    base: "http://localhost:4173",
  });
  return (
    <>
      <div>Hello World</div>
      <div>Components Available</div>
      <hr />
      <p>list of remote container components from SSR data</p>
      {serverData.map((name, index) => (
        <RuntimeComponent key={name + index} name={name} />
      ))}

      <hr />
      <p>list of hardcoded remote container components</p>
      <RuntimeComponent name="ComponentA" />
      <RuntimeComponent name="ComponentB" />
      <RuntimeComponent name="ComponentC" />

      <hr />
      <p>client only container components</p>
      <RuntimeComponent
        name="ComponentC"
        fallback={<div>Loading...</div>}
        clientOnly={true}
      />
      <RuntimeComponent
        name="ComponentD"
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
