# mfw – Minimal Platform-Independent SSR Framework

`mfw` is a micro-framework for building server-rendered web applications using nothing but plain JavaScript, file-based views, and a simple routing model.

It is:

- ✅ Platform-independent (works with any HTTP server)
- ✅ Zero dependencies
- ✅ File-based routing, no configs
- ✅ No bundlers, no hydration, no complexity

---

## 🧱 Core Concepts

- Views are plain `.js` modules that export HTML string functions
- Routing is derived from filenames (like `TasksPage.js` → `/tasks`)
- You bring your own HTTP server (Node, Deno, Bun, etc.)

---

## 🚀 Usage

```js
import http from 'http';
import { getRouteMap, handleRoute } from './mfw/index.js';

const routes = getRouteMap('./ui/views', { root: 'LandingPage', notFound: 'My404Page' });
const render = handleRoute(routes, './ui/views');

const server = http.createServer(async (req, res) => {
  const html = await render(req.url);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(3000, () => console.log('http://localhost:3000'));
```

---

## 📁 File Structure Example

```
/ui/views/
  ├── LandingPage.js    → /
  ├── TasksPage.js      → /tasks
  └── My404Page.js      → /404
```

---

## 📦 Exports

From `mfw/index.js`:

- `getRouteMap(viewDir, { root?, notFound? })`
- `handleRoute(routeMap, viewDir)`
- `resolveComponent(viewName, viewDir)`
- `store(initialValue)` (optional mutable state helper)

---
