import { component$ } from "@builder.io/qwik";

export const ComponentA = component$(({ text = "cmp A" }: any) => {
  return <h1>{text}</h1>;
});
