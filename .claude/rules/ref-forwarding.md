# React 19 / ref Forwarding (core)

## React 19 conventions

- **`ref` is a regular prop** — do not use `forwardRef()`. Accept `ref` directly in the props destructuring:

  ```ts
  // Correct — React 19
  interface ButtonProps { ref?: React.Ref<HTMLButtonElement>; ... }
  const Button = ({ ref, ...props }: ButtonProps) => <button ref={ref} {...props} />;
  ```

- Use the `use()` hook for promise/context unwrapping, `useOptimistic`/`useActionState` for form-related components, and native `<form action={...}>` Server Actions over manual submit handlers, wherever they simplify code.
- This is the target pattern going forward (see `target-architecture-status.md`) — most existing components still use `forwardRef` + `memo`. Don't rewrite an untouched component just to migrate this; use the new pattern for new components and when a component is substantially touched anyway.

## Every component must forward its ref

**Every component in the library must accept and forward a `ref`** to its primary DOM element. Non-negotiable — consumers rely on it to attach `Tooltip`, `Popover`, `Dropdown`, and other overlay components, including through nested chains (e.g. a `ref` passed to a `Button` that sits inside a `Tooltip` inside a `Dropdown` trigger must reach the actual `<button>`).

- Accept `ref` as a plain prop (React 19 style, no `forwardRef`).
- Always pass `ref` down to the **root DOM element**, not a wrapper `div`. If a component renders another Altrone component as its root, pass `ref` through to that component's `ref` prop.
- Never swallow or ignore a `ref` prop.

## Don't

- Don't use class components.
- Don't use `forwardRef()` in new code — accept `ref` as a plain prop.
- Don't write a component without forwarding `ref` to its root DOM element.
