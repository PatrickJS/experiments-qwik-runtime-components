import { component$ } from "@builder.io/qwik";

export const ComponentD = component$(({ text = "cmp D" }: any) => {
  return <h1>{text}</h1>;
});
