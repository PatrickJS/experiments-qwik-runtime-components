import { ComponentA } from "./components/ComponentA";
import { ComponentB } from "./components/ComponentB";

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <ComponentA />
        <ComponentB />
      </body>
    </>
  );
};
