# MFW

A tiny server-rendered HTML-first helper

## Features

- Partial-based architecture with structs and parts
- Automatic CSS and JS injection
- Simple view routing
- Caching for improved performance
- Type-safe partial loading

## Quick Start

```javascript
const { renderHtmlView } = require('mfw/lib/renderHtmlView');

// Render a view
const html = await renderHtmlView('home', {
  viewsDir: 'views',
  publicDir: 'public'
});
```

## Partial System

### Views
Views are the top-level html that define a page:

```html
<!-- views/home/home.html -->
<view-root>
  <h1>Welcome to MFW</h1>
  
  <!-- Standalone parts -->
  <part name="intro"/>
  <part name="button"/>
  
  <!-- A struct with its own parts -->
  <struct name="card-shell"/>
  
  <!-- Another standalone part -->
  <part name="footer"/>
</view-root>
```

### Structs
Structs are structural partials that can contain parts:

```html
<!-- structs/card-shell/card-shell.html -->
<div class="card-shell">
  <div class="card-header">
    <part name="header"></part>
  </div>
  <div class="card-content">
    <part name="content"></part>
  </div>
</div>
```

### Parts
Parts are content partials that can be used in views or structs:

```html
<!-- parts/button/button.html -->
<button class="mfw-button">
  Get Started
</button>
```

## Directory Structure

```
mfw/
├── lib/                    # Core framework code
│   ├── renderHtmlView.js   # View rendering
│   ├── injectByName.js     # Name-based injection
│   ├── injectPartials.js   # Partial processing
│   └── router.js          # Simple view routing
├── views/                  # View files
│   └── home/
│       ├── home.html
│       ├── home.css
│       └── home.js
├── structs/               # Structural partials
│   └── card-shell/
│       ├── card-shell.html
│       └── card-shell.css
├── parts/                 # Content partials
│   └── button/
│       ├── button.html
│       └── button.css
└── public/               # Static assets
    ├── css/
    │   └── main.css
    └── js/
        └── main.js
```

## API Reference

### renderHtmlView(viewName, options)

Renders a complete HTML page.

```javascript
const html = await renderHtmlView('home', {
  appPath: 'app.html',     // Layout file
  viewsDir: 'views',       // Views directory
  publicDir: 'public'      // Public assets directory
});
```

### injectByName(filePath, options)

Injects content into structs and parts.

```javascript
const { html, cssPaths } = await injectByName('views/home/home.html', {
  type: 'view',
  viewsDir: 'views',
  publicDir: 'public'
});
```
