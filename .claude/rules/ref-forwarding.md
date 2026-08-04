# React 19 / ref Forwarding (core)

## React 19 conventions

Use React 19 APIs wherever applicable:

- **`ref` is a regular prop** — do not use `forwardRef()`. Accept `ref` directly in the props destructuring:

  ```ts
  // Correct — React 19
  interface ButtonProps { ref?: React.Ref<HTMLButtonElement>; ... }
  const Button = ({ ref, ...props }: ButtonProps) => <button ref={ref} {...props} />;

  // Wrong — React 18 legacy, do not write this
  const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => ...);
  ```

- Use the `use()` hook for promise/context unwrapping where it simplifies code.
- Use `useOptimistic` and `useActionState` for form-related components where appropriate.
- Prefer native `<form action={...}>` Server Actions over manual submit handlers when the component is form-based.

This is the target pattern going forward (see `target-architecture-status.md`) — most existing components still use `forwardRef` + `memo`. Don't rewrite an untouched component just to migrate this; use the new pattern for new components and when a component is substantially touched anyway.

## Every component must forward its ref

**Every component in the library must accept and forward a `ref`** to its primary DOM element. Non-negotiable — consumers rely on it to attach `Tooltip`, `Popover`, `Dropdown`, and other overlay components.

Complex chains must work transparently, e.g.:

```tsx
<Dropdown
  trigger={
    <Tooltip content="Add item">
      <Button ref={someRef}>Click</Button>
    </Tooltip>
  }
>
  ...
</Dropdown>
```

Rules:

- Accept `ref` as a plain prop (React 19 style, no `forwardRef`).
- Always pass `ref` down to the **root DOM element**, not a wrapper `div`.
- If a component renders another Altrone component as its root, pass `ref` through to that component's `ref` prop.
- Never swallow or ignore a `ref` prop.

## Don't

- Don't use class components.
- Don't use `forwardRef()` in new code — accept `ref` as a plain prop.
- Don't write a component without forwarding `ref` to its root DOM element.
