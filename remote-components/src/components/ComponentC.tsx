import { component$ } from "@builder.io/qwik";

/**
 * @public
 */
export const ComponentC = component$(({ text = "cmp C" }: any) => {
  return (
    <div>
      <div>something: example content</div>
      <button onClick$={() => console.log("hello world")}>{text}</button>
    </div>
  );
});
