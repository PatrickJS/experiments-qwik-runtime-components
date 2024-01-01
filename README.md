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