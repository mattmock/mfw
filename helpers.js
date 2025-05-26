export function resolveComponent(path) {
  const parts = path.split('/');
  const file = parts.at(-1);
  const folder = parts.at(-2);
  return folder === file ? path : `${path}/${file}`;
}
