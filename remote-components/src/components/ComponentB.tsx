import { component$ } from "@builder.io/qwik";

interface ComponentBProps {
  text?: string;
}

/**
 * @public
 */
export const ComponentB = component$(({ text = "cmp B" }: ComponentBProps) => {
  return <h1>{text}</h1>;
});
