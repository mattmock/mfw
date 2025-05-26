# mfw API Reference

---

## `getRouteMap(viewDirPath, options?)`

Returns an object mapping URL paths to view file names based on the files in your directory.

```ts
getRouteMap('./ui/views', {
  root: 'LandingPage',
  notFound: 'My404Page'
});
```

**Result:**
```ts
{
  '/': 'LandingPage',
  '/tasks': 'TasksPage',
  '/404': 'My404Page'
}
```

---

## `handleRoute(routeMap, viewDirPath)`

Returns a function that resolves a given URL path to an HTML string.

```ts
const render = handleRoute(routeMap, './ui/views');
const html = await render('/tasks');
```

---

## `resolveComponent(viewName, viewDirPath)`

Dynamically imports and executes a view module to get its HTML.

```ts
const html = await resolveComponent('TasksPage', './ui/views');
```

---

## `store(initialValue)`

A minimal reactive store pattern.

```ts
const count = store(0);
count.subscribe(val => console.log(val));
count.update(n => n + 1);
```

API:
- `get()` → current value
- `set(value)` → set value
- `update(fn)` → transform value
- `subscribe(fn)` → react to changes
