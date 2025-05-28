# MFW

**Minimal Frontend Wrapper** – a tiny server-rendered HTML-first helper

* HTML lives in `.html`, not JS
* CSS lives in `.css`, not inline
* Minimal dependencies, zero runtime
* No client-side frameworks, no bundlers required
* Reusable HTML via partials, injected with light logic (Node-only for now)

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
│
├── .gitignore
├── package.json
└── README.md
```

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

## 🪶 Lightweight & Extensible

MFW is Node-based, but the concept is portable to other stacks. Just bring your own HTML parser.

* Want typed routes? Add your own router.
* Want to plug it into a Rust, Python, or Go backend? No problem — MFW is frontend-only.

MIT License
