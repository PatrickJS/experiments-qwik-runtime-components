import { component$ } from "@builder.io/qwik";

export const ComponentC = component$(({ text = "cmp C" }: any) => {
  return <h1>{text}</h1>;
});
