/**
 * Dynamically imports a view component by name and path.
 */
export async function resolveComponent(name, viewDirPath) {
  const modulePath = path.join(viewDirPath, name + '.js');
  try {
    const module = await import(modulePath);
    return module.default;
  } catch (e) {
    console.error(`[resolveComponent] Failed to load: ${name} from ${modulePath}`, e);
    throw e;
  }
}
