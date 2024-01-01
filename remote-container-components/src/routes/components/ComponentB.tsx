import { component$ } from "@builder.io/qwik";

export const ComponentB = component$(({ text = "cmp B" }: any) => {
  return <h1>{text}</h1>;
});
