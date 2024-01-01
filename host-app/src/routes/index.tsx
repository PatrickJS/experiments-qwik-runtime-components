import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { RuntimeComponent } from "~/components/RuntimeComponent";

export default component$(() => {
  return (
    <>
      <div>Hello World</div>
      <div>Components Available</div>
      <p>type in anything with the component name below</p>
      <RuntimeComponent
        base="http://localhost:5174/components"
        name="ComponentA"
      />
      <RuntimeComponent
        base="http://localhost:5174/components"
        name="ComponentB"
      />
      <RuntimeComponent
        base="http://localhost:5174/components"
        name="ComponentC"
        fallback={<div>Loading...</div>}
        clientOnly={true}
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
