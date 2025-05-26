# MFW
lil bb simple web app framework 

## ✨ Features

* `renderComponent(name, el, props)` – Declarative HTML-driven rendering
* `data-*` bindings for text, HTML, and attributes
* Optional `onMount` and `onUnmount` lifecycle hooks
* `MFW.Router` – Basic hash/history-based routing (optional)
* `MFW.Store` – Global reactive state store (optional)
* TypeScript `.d.ts` types included for app-side autocomplete
* Components live in `/components/`, organized how you like
* No dependencies

---

## 🛠 Example Usage

```js
import { MFW } from './mfw/core.js';
import { resolveComponent } from './mfw/helpers.js';

MFW.renderComponent(resolveComponent('shared/avatar'), document.body, {
  name: 'Matt',
  image: '/avatar.png'
});
```

---

## 📁 Project Structure

```
mfw/
├── core.js          # Framework core
├── core.d.ts        # TypeScript type declarations
├── router.js        # Optional client-side routing
├── store.js         # Optional state manager
└── helpers.js       # e.g. resolveComponent(path)
```

App-side:

```
components/
└── shared/
    └── avatar/
        ├── avatar.html
        ├── avatar.css
        └── avatar.js

views/
└── user/
    └── profile.js
```

---
