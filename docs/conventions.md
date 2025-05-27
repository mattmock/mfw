# mfw Conventions

## Views and Components

- Views live in `/ui/views/`
- Components live in `/ui/components/[name]/[name].html`

## Component Includes

Use `{{> name }}` to include components. For example:

```html
<div class="page">
  <h1>Welcome</h1>
  {{> header }}
  <main>
    {{> sidebar }}
    {{> content }}
  </main>
</div>
```

### Component Limitations

- Components cannot receive props (use global props instead)
- Maximum include depth is 10 levels
- Component names must be alphanumeric with hyphens/underscores
- Components should be self-contained (no external dependencies)

### Best Practices

1. Keep components small and focused
2. Use semantic HTML
3. Avoid circular dependencies
4. Use global props for shared data
5. Keep component paths simple and flat
