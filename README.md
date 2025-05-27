# mfw – Minimal HTML-Driven SSR Framework

`mfw` is a tiny server-side rendering microframework that uses native `.html` files as views. It’s framework-agnostic, dependency-free, and built to work with any HTTP server (Node, Deno, Bun, Python, etc).

---

## ✅ Features

- 📄 Views as plain `.html` files
- 🔧 File-based routing (e.g. `/about.html` → `/about`)
- 🧠 No hydration, no bundlers, no JS-based views
- 🧱 Works with any HTTP server (Express, http.createServer, etc.)
- 💬 Simple variable interpolation via `{{key}}`

---

## 🛠 Example Usage

```js
import http from 'http';
import { getRouteMap, handleRoute } from './mfw/index.js';

const viewDir = './ui/views';
const routes = getRouteMap(viewDir, { root: 'index', notFound: '404' });
const render = handleRoute(routes, viewDir, {
  props: { title: 'My Site' },
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
```

---

## 📦 Exports

From `mfw/index.js`:

- `getRouteMap(viewDirPath, { root?, notFound? })`  
- `handleRoute(routeMap, viewDirPath, { props?, errorView? })`  
- `resolveHtmlView(viewName, viewDirPath, props?)`

---

## 📝 Notes

- You can use `{{key}}` syntax in your `.html` files for prop substitution
- This system is logic-free on purpose (no conditionals/loops)
- You are free to extend it with a templating engine if needed

---

## 🔗 Links

- [Docs: API Reference](./docs/api.md)
- [Docs: Folder Conventions](./docs/conventions.md)
