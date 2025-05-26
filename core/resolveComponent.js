import path from 'path';

export async function resolveComponent(name, viewDirPath) {
  const modulePath = path.join(viewDirPath, name + '.js');
  try {
    const module = await import(modulePath);
    if (typeof module.default !== 'function') {
      throw new Error(`View ${name} must export a default function`);
    }
    return module.default();
  } catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND') {
      throw new Error(`View not found: ${name}`);
    }
    throw e;
  }
}
