# mfw API Reference

---

## defineFileRoutes(viewDirPath, options)

```js
app.use(defineFileRoutes('./ui/views', {
  root: 'LandingPage',
  notFound: 'My404Page'
}));
```

| Option       | Type   | Description                                  |
|--------------|--------|----------------------------------------------|
| `viewDirPath`| string | Absolute or relative path to your views dir  |
| `root`       | string | The view used for `/` (default: `HomePage`)  |
| `notFound`   | string | The view used for `/404` and unknown paths   |

---

## controller(fn)

```js
app.post('/api/tasks', controller(async (req, res) => {
  const task = req.body;
  await saveTask(task);
  res.send({ ok: true });
}));
```

Wraps async route logic, logs errors, and returns 500 on unhandled exceptions.

---

## resolveComponent(name, viewDirPath)

```js
const html = await resolveComponent('TasksPage', './ui/views');
```

Dynamically imports a JS view file by name.

---

## store() (Optional)

```js
const counter = store(0);
counter.get();      // 0
counter.set(5);     // 5
counter.update(n => n + 1); // 6
```

Simple mutable state container.
