# MFW - Modern Framework

A modern framework for building web applications with a focus on simplicity and maintainability.

## Features

- Component-based architecture with structs and parts
- Automatic CSS and JS injection
- Data attribute interpolation
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

## Component System

### Views
Views are the top-level components that define a page:

```html
<!-- views/home.html -->
<struct name="header">
  <part name="title">Welcome</part>
</struct>

<struct name="content">
  <part name="main">Hello World!</part>
</struct>
```

### Structs
Structs are structural components that can contain parts:

```html
<!-- structs/card-shell/card-shell.html -->
<div class="card" data-theme="{{ data-theme }}">
  <part name="header"></part>
  <part name="content"></part>
</div>
```

### Parts
Parts are content components that can be injected into structs:

```html
<!-- parts/button/button.html -->
<button class="btn" data-variant="{{ data-variant }}">
  {{ data-content }}
</button>
```

## Data Attributes

Use data attributes to pass data to components:

```html
<struct name="card" data-theme="dark" data-title="My Card">
  <part name="header" data-content="Card Header"></part>
</struct>
```

## Directory Structure

```
mfw/
├── lib/                    # Core framework code
│   ├── renderHtmlView.js   # View rendering
│   ├── injectByName.js     # Name-based injection
│   └── injectPartials.js   # Partial processing
├── views/                  # View files
│   └── home/
│       ├── home.html
│       ├── home.css
│       └── home.js
├── structs/               # Structural components
│   └── card-shell/
│       ├── card-shell.html
│       └── card-shell.css
├── parts/                 # Content components
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
const { html, cssPaths } = await injectByName('views/home.html', {
  type: 'view',
  viewsDir: 'views',
  publicDir: 'public',
  data: {
    theme: 'dark'
  }
});
```

## License

MIT
