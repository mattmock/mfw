# MFW v2 (Minimal File-based Web Framework)

MFW is a minimalist SSR rendering helper that works directly with HTML files, partials, and variable injection. It avoids JSX, hydration, or client-side frameworks entirely.

## Core Philosophy

- **Native HTML** — Use `.html` files directly for views and components
- **Server-Side Rendering (SSR)** — Render everything before sending it to the browser
- **Partial Includes** — `{{> partial-name}}` for reusable markup
- **Variable Interpolation** — `{{ title }}`, `{{ content }}`, etc.
- **No Build Step** — Works with any server, no bundlers required

## Folder Structure (suggested)

```
/core/
  resolveHtmlView.js
  renderPage.js
  utils.js
```

## Example Usage

```js
import { renderPage } from './core/renderPage.js';

const html = await renderPage("home", { title: "Welcome" }, { layout: "layout" });
res.send(html);
```

## Use It With Any Node Server

MFW does not provide routing or HTTP handling — bring your own (Express, Koa, etc.)
