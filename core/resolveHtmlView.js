import fs from 'fs/promises';
import path from 'path';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function resolveHtmlView(name, viewDirPath, props = {}) {
  const filePath = path.join(viewDirPath, name + '.html');
  let html = await fs.readFile(filePath, 'utf-8');

  for (const [key, value] of Object.entries(props)) {
    html = html.replaceAll(`{{${key}}}`, escapeHtml(String(value)));
  }

  return html;
}
