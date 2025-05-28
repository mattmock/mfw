import { readFile } from "fs/promises";
import { join } from "path";
import { escapeHtml } from "./utils.js";

// Loads .html views and interpolates variables + partials
async function readHtml(filePath) {
  try {
    return await readFile(filePath, "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`File not found: ${filePath}`);
    }
    throw error;
  }
}

async function resolvePartials(content, partialsDir, depth = 0) {
  if (depth > 10) {
    throw new Error("Maximum partial nesting depth (10) exceeded");
  }

  const partialPattern = /{{>\s*([a-zA-Z0-9\-_]+)\s*}}/g;
  let result = content;
  let match;

  while ((match = partialPattern.exec(content)) !== null) {
    const [fullMatch, name] = match;
    const partialPath = join(partialsDir, `${name}.html`);
    const partial = await readHtml(partialPath);
    const resolvedPartial = await resolvePartials(partial, partialsDir, depth + 1);
    result = result.replace(fullMatch, resolvedPartial);
  }

  return result;
}

function interpolate(content, context) {
  return content.replace(/{{\s*([^}\s]+)\s*}}/g, (_, key) => {
    return key in context ? escapeHtml(context[key]) : "";
  });
}

export async function resolveHtmlView(viewName, context = {}) {
  // Validate viewName to prevent directory traversal
  if (!/^[a-zA-Z0-9\-_]+$/.test(viewName)) {
    throw new Error("Invalid view name. Only alphanumeric characters, hyphens, and underscores are allowed.");
  }

  const root = process.cwd();
  const viewsDir = join(root, "views");
  const partialsDir = join(root, "partials");
  const viewPath = join(viewsDir, `${viewName}.html`);
  
  let content = await readHtml(viewPath);
  content = await resolvePartials(content, partialsDir);
  return interpolate(content, context);
}
