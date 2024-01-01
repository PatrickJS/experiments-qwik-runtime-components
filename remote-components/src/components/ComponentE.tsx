import { component$ } from "@builder.io/qwik";

/**
 * @public
 */
export const ComponentE = component$(({ text = "cmp E" }: any) => {
  return <h1>{text}</h1>;
});
