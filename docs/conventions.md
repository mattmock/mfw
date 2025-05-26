# mfw View and Folder Conventions

---

## Directory layout

```
/ui
  /views         ← Route-level HTML renderers
  /components    ← Shared layout/presentation helpers
  /public        ← Static assets (CSS, images)
```

---

## Views

A view is a JS module that exports a function returning an HTML string:

```js
export default function LandingPage() {
  return `
    <html>
      <body>
        <h1>Welcome</h1>
      </body>
    </html>
  `;
}
```

Wrap views using a shared Layout from `components/Layout.js`.

---

## Routing

These files automatically become routes:

| File              | Route     |
|-------------------|-----------|
| `LandingPage.js`  | `/`       |
| `TasksPage.js`    | `/tasks`  |
| `My404Page.js`    | `/404`    |

Filenames are stripped of `Page` and lowercased.

---

## Static files

Anything in `/ui/public` is served at `/`:

```html
<link rel="stylesheet" href="/styles.css">
```
