import { component$, useServerData } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { RuntimeComponent } from "~/components/RuntimeComponent";

export default component$(() => {
  const serverData = useServerData<string[]>("SERVER_DATA", ["ComponentA"]);
  return (
    <>
      <div>Hello World</div>
      <div>Components Available</div>
      <hr />
      <p>list of remote container components from SSR data</p>
      {serverData.map((name) => (
        <RuntimeComponent base="http://localhost:5174/components" name={name} />
      ))}

      <hr />
      <p>list of hardcoded remote container components</p>
      <RuntimeComponent
        base="http://localhost:5174/components"
        name="ComponentA"
      />
      <RuntimeComponent
        base="http://localhost:5174/components"
        name="ComponentB"
      />

      <hr />
      <p>client only container components</p>
      <RuntimeComponent
        base="http://localhost:5174/components"
        name="ComponentC"
        fallback={<div>Loading...</div>}
        clientOnly={true}
      />
      <RuntimeComponent
        base="http://localhost:5174/components"
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
