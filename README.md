# Example of Runtime Components

> Work in progress. Proof of concept

building on top of the original PoC https://github.com/PatrickJS/qwik-dynamic-cmp to get runtime components workflow in Qwik

`/host-app/src/components/RuntimeComponent.tsx`
> runtime config to fetch component
```tsx
useContextProvider(RuntimeContext, {
  origin: "http://localhost:4173",
});

<RuntimeComponent name="ComponentA"/>
<RuntimeComponent name="ComponentB"/>
<RuntimeComponent
  name="ComponentC"
  fallback={<div>Loading...</div>}
  clientOnly={true}
/>
```

---
`/host-app/src/routes/index.tsx`
> example of all the components and @remote type
```javascript
import { ComponentA } from "@remote/AppComponents";

<ComponentA text="remote import type">
  <div>HELLO inside componentA</div>
</ComponentA>

```
this component needs the contents downloaded from `/remote-components/` using the plugin `/host-app/plugins/remote.mjs`

---
`/remote-container-components/`
> this server will return container components based on some config in `remote-container-components/src/entry.ssr.tsx`
> Here is the list of components
```
/remote-container-components/src/routes/components/ComponentA.tsx
/remote-container-components/src/routes/components/ComponentB.tsx
/remote-container-components/src/routes/components/ComponentC.tsx
/remote-container-components/src/routes/components/ComponentD.tsx
/remote-container-components/src/routes/components/ComponentE.tsx
```
