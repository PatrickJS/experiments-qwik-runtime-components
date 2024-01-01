import { Slot, component$ } from "@builder.io/qwik";

/**
 * @public
 */
export const ComponentA = component$(({ text = "cmp A" }: any) => {
  return (
    <div>
      <h1>{text}</h1>
      <div>
        <Slot />
      </div>
    </div>
  );
});
