# mfw – Minimal HTML-Driven SSR Framework

`mfw` is a tiny server-side rendering microframework built around native `.html` files and file-based routing. It’s framework-agnostic, dependency-free, and designed for flexibility with zero frontend framework assumptions.

---

## ✅ Features

- 📄 Views as plain `.html` files (not JS templates)
- 🔧 File-based routing (e.g. `index.html` → `/`)
- 🔌 Component support via `{{> name }}` includes
- 🔐 Safe variable interpolation with `{{key}}`
- 🧱 Works with any server (Express, Node http, Bun, Deno, etc.)
- 🧠 No hydration, no build step, no VDOM

---

## 🛠 Example Usage

```js
import http from 'http';
import { getRouteMap, handleRoute } from './mfw/index.js';

const viewDir = './ui/views';
const componentDir = './ui/components';

const routes = await getRouteMap(viewDir, { root: 'index', notFound: '404' });
const render = handleRoute(routes, viewDir, {
  props: { title: 'My Site' },
  componentDirPath: componentDir,
  errorView: 'error'
});

http.createServer(async (req, res) => {
  const html = await render(req.url);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}).listen(3000);
```

---

## 📁 Folder Structure

```
/ui/views/
  ├── index.html      → /
  ├── about.html      → /about
  ├── 404.html        → fallback
  └── error.html      → optional error fallback

/ui/components/
  /header/header.html
  /card/card.html
```

---

## 🧩 Template Syntax

- `{{title}}` → Safe substitution with provided `props`
- `{{> card }}` → Includes `/ui/components/card/card.html`
- Includes support nesting (max depth 10)
- Components are static only (no logic, no props)

---

## 📦 Exports

From `mfw/index.js`:

- `getRouteMap(viewDir, { root?, notFound? })`
- `handleRoute(routeMap, viewDir, { props?, componentDirPath?, errorView? })`
- `resolveHtmlView(name, viewDir, props?, componentDirPath?)`

---

## 📝 Philosophy

- HTML is the source of truth
- No build tools required
- Logic stays on the server
- Extend with your own middleware, routes, state

---

## 🔗 Docs

- [API Reference](./docs/api.md)
- [Folder Conventions](./docs/conventions.md)
