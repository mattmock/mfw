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

async function injectIncludes(html, componentDirPath, depth = 0) {
  if (!componentDirPath || depth > 10) return html; // Prevent infinite recursion
  
  const includePattern = /{{>\s*([a-zA-Z0-9\-_]+)\s*}}/g;
  const matches = [...html.matchAll(includePattern)];
  
  if (matches.length === 0) return html;
  
  let result = html;
  for (const match of matches) {
    const [fullMatch, name] = match;
    const safeName = name.replace(/[^a-zA-Z0-9\-_]/g, ''); // Sanitize component name
    
    try {
      const filePath = path.join(componentDirPath, safeName, safeName + '.html');
      const componentHtml = await fs.readFile(filePath, 'utf-8');
      // Recursively process nested includes
      const processedComponent = await injectIncludes(componentHtml, componentDirPath, depth + 1);
      result = result.replace(fullMatch, processedComponent);
    } catch (err) {
      console.error(`[injectIncludes] Failed to load component: ${safeName}`, err);
      result = result.replace(fullMatch, `<div style="color:red">Missing component: ${safeName}</div>`);
    }
  }
  
  return result;
}

export async function resolveHtmlView(name, viewDirPath, props = {}, componentDirPath) {
  const filePath = path.join(viewDirPath, name + '.html');
  let html = await fs.readFile(filePath, 'utf-8');

  // Replace props first
  for (const [key, value] of Object.entries(props)) {
    html = html.replaceAll(`{{${key}}}`, escapeHtml(String(value)));
  }

  // Then handle includes
  html = await injectIncludes(html, componentDirPath);
  return html;
}
