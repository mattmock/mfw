/**
 * Dynamically imports a view component by name and path.
 */
export async function resolveComponent(name, viewDirPath) {
  const modulePath = path.join(viewDirPath, name + '.js');
  const module = await import(modulePath);
  return module.default();
}
