# Example of Runtime Component

`/host-app/src/components/RuntimeComponent.tsx`
> runtime config to fetch component
```javascript
<RuntimeComponent
  base="http://localhost:5174/components"
  name="ComponentA"
/>
<RuntimeComponent
  base="http://localhost:5174/components"
  name="ComponentB"
/>
<RuntimeComponent
  base="http://localhost:5174/components"
  name="ComponentC"
  fallback={<div>Loading...</div>}
  clientOnly={true}
/>
```

`/remote-components/src/routes/components/[...component]/index.tsx`
> host components somewhere in this example we're using SSR but this can just be SSG into s3 and versioned by folder
> /remote-components/src/components/index.tsx
> /remote-components/src/components/component-a.tsx
> /remote-components/src/components/component-b.tsx
> /remote-components/src/components/component-c.tsx
> /remote-components/src/components/component-e.tsx
> /remote-components/src/components/component-e.tsx