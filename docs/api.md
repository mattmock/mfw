# mfw API Reference

---

## `getRouteMap(viewDirPath, options?)`

Maps view files to routes.

## `handleRoute(routeMap, viewDirPath, options?)`

Returns a handler for rendering routes to HTML strings.

Options:
- `props`: data for `{{key}}` replacement
- `errorView`: fallback view
- `componentDirPath`: base path for `{{> component }}` includes

## `resolveHtmlView(...)`

Reads an HTML file, replaces `{{key}}` and `{{> name }}` includes.
