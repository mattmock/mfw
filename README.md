# mfw – Minimal Server-Side Rendering Framework

`mfw` is a tiny zero-dependency JavaScript framework for building server-rendered web apps using Express and plain JS views. It provides:

- ✅ File-based routing for views
- ✅ Async-safe route handlers
- ✅ Dynamic view resolution
- ✅ Optional state management helper
- ❌ No hydration, no bundlers, no frontend runtime

---

## Installation

Just copy the files (`router.js`, `controller.js`, `helpers.js`) into your project.

---

## Usage

```js
import express from 'express';
import { defineFileRoutes } from './mfw/router.js';

const app = express();
app.use(express.json());

app.use(defineFileRoutes('./ui/views', {
  root: 'LandingPage',
  notFound: 'My404Page'
}));
```

### Views (`ui/views/*.js`)

```js
import Layout from '../components/Layout.js';

export default function TasksPage() {
  return Layout(`<h1>Tasks</h1><p>Here's some HTML!</p>`);
}
```

---

## API

### `defineFileRoutes(viewDirPath, options?)`
Creates a middleware that maps routes to views based on filenames.

### `controller(fn)`
Wraps an async Express handler with automatic error handling.

### `resolveComponent(viewName, viewDirPath)`
Dynamically loads a JS module and returns its default export.

### `store()` _(optional)_
Lightweight mutable state store.
