import { component$ } from "@builder.io/qwik";

/**
 * @public
 */
export const ComponentD = component$(({ text = "cmp D" }: any) => {
  return <h1>{text}</h1>;
});
