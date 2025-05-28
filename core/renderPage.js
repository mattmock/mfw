import { resolveHtmlView } from "./resolveHtmlView.js";

// Optional helper to wrap views with layout
export async function renderPage(viewName, viewContext, layoutContextOverrides = {}) {
  const content = await resolveHtmlView(viewName, viewContext);
  if (!layoutContextOverrides.layout) return content;
  return resolveHtmlView(layoutContextOverrides.layout, {
    ...viewContext,
    ...layoutContextOverrides,
    content
  });
}
