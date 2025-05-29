# MFW

**Minimal Frontend Wrapper** – a tiny server-rendered HTML-first helper

* HTML lives in `.html`, not JS
* CSS lives in `.css`, not inline
* Minimal dependencies, zero runtime
* No client-side frameworks, no bundlers required
* Reusable HTML via partials, injected with light logic (Node-only for now)

## 🚀 Getting Started

### Quick Start

For a ready-to-use starter project with examples, check out [mfw-starter](https://github.com/mattmock/mfw-starter).

### Core Usage

1. Get the core files:
```bash
npx degit mattmock/mfw
# or just copy lib/ and views/layout.html to your project
```

2. Create your first view (`views/home.html`):
```html
<div class="page">
  <h1>Welcome to My App</h1>
  <div tag="partial"></div>
</div>
```

3. Use the core functions in your server (express example):

```js
const express = require('express');
const path = require('path');
const { renderHtmlView } = require('./lib/renderHtmlView');
const { injectByTag } = require('./lib/injectByTag');

app.get('/', async (req, res) => {
  try {
    const baseViewPath = path.join('views', 'home.html');
    const pageContent = await injectByTag(
      baseViewPath,
      { partial: await injectByTag(path.join('views', 'partials', 'example.html')) }
    );
    const html = await renderHtmlView('home', { view: pageContent });
    res.send(html);
  } catch (err) {
    res.status(500).send(`<pre>${err.message}</pre>`);
  }
});
```

### The Layout Shell

`views/layout.html` is your app's HTML shell. It defines the base structure and includes placeholders for dynamic content:

```html
<!DOCTYPE html>
<html>
<head>
  <title>MFW</title>
  {{ cssPath }}  <!-- Injects view-specific CSS if it exists -->
</head>
<body>
  {{ view }}     <!-- Injects your view's HTML -->
  {{ jsPath }}   <!-- Injects view-specific JS if it exists -->
</body>
</html>
```

When you call `renderHtmlView('home')`, it:
1. Loads this layout
2. Injects your view's HTML into `{{ view }}`
3. Adds any view-specific CSS/JS via `{{ cssPath }}` and `{{ jsPath }}`

### Injecting Partials

Add `tag="..."` attributes to elements in your HTML:

```html
<div class="card">
  <h2 tag="title">Default Title</h2>
  <p tag="content">Default content</p>
</div>
```

Inject content by matching tag names:

```js
await injectByTag('views/partials/card.html', {
  title: 'Custom Title',
  content: 'Custom description'
});
```

Note: Each tag name must be unique within a partial. Duplicate tags will throw an error.

### Dependencies

MFW requires:
- `node-html-parser` for HTML parsing and manipulation
- `express` (optional) for the example server

## 📁 Project Structure

```
mfw/
├── views/
│   └── layout.html          # Layout shell (wraps views)
│
├── lib/
│   ├── injectByTag.js       # Partial injection via tag="..."
│   └── renderHtmlView.js    # Resolves layout, view, CSS/JS
│
├── test/
│   └── injectByTag.test.js  # Unit tests for core injection logic
│   └── renderHtmlView.test.js  # Unit tests for view rendering
│
├── .gitignore
├── package.json
└── README.md
```

MIT License
