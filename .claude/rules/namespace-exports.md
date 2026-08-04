# Namespace Exports (core)

All components with sub-components are exported as a namespace object:

```ts
// ComponentName.tsx
const ComponentNameBase = memo<ComponentNameProps>(({ ... }) => { ... });

export const ComponentName = Object.assign(ComponentNameBase, {
  SubComponent: SubComponent,
});
```

```ts
// index.ts
export { ComponentName } from './ComponentName';
```

## Don't

- Don't export a component without a namespace if it has sub-components.
