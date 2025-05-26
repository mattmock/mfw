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
const render = handleRoute(routes, './ui/views', {
  errorView: 'ErrorView' // shown if any view throws during rendering
});

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
  ├── ErrorView.js      → error fallback
  └── My404Page.js      → /404
```

---

## 🔒 Security

The framework includes a simple HTML escape utility to prevent XSS attacks:

```js
import { escapeHtml } from './mfw/index.js';

export default function UserProfilePage() {
  const userInput = '<script>alert("xss")</script>';
  return `
    <div>
      <h1>User Profile</h1>
      <p>Safe: ${escapeHtml(userInput)}</p>
    </div>
  `;
}
```

---

## ⚠️ Error Handling

Views can throw errors during rendering. The framework will:

1. Try to render the configured error view
2. If that fails, show a simple error message
3. Log the error to console

```js
// ErrorView.js
export default function ErrorView() {
  return `
    <div class="error">
      <h1>Something went wrong</h1>
      <p>Please try again later</p>
    </div>
  `;
}
```

---

## 📦 Exports

From `mfw/index.js`:

- `getRouteMap(viewDir, { root?, notFound? })`
- `handleRoute(routeMap, viewDir, { errorView? })`
- `resolveComponent(viewName, viewDir)`
- `escapeHtml(str)` (XSS protection)
- `store(initialValue)` (optional mutable state helper)

---
