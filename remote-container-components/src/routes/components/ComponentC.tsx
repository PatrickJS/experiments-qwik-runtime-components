import { component$ } from "@builder.io/qwik";

export const ComponentC = component$(({ text = "cmp C" }: any) => {
  return (
    <div>
      <div>something: example content</div>
      <button
        onClick$={() => console.log("hello from remote container component ")}
      >
        {text}
      </button>
    </div>
  );
});
