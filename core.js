export async function renderComponent(name, targetEl, props = {}, methods = {}, options = {}) {
  const [folder, file] = name.split('/').slice(-2);
  const isView = name.startsWith('views/');
  const basePath = isView ? `./${name}` : `./components/${name}`;
  const templatePath = `${basePath}.html`;
  const cssPath = `${basePath}.css`;

  const res = await fetch(templatePath);
  const html = await res.text();
  const container = document.createElement('div');
  container.innerHTML = html;

  const template = container.querySelector(`template#${file}`);
  if (!template) throw new Error(`Template <template id="${file}"> not found in ${templatePath}`);

  const wrapper = document.createElement('div');
  const clone = template.content.cloneNode(true);
  bindProps(clone, props);
  bindEvents(clone, props, methods);
  wrapper.appendChild(clone);
  targetEl.appendChild(wrapper);

  if (options.onMount) options.onMount(wrapper);
  wrapper._onUnmount = options.onUnmount || null;

  function render(updatedProps = {}) {
    if (wrapper._onUnmount) wrapper._onUnmount(wrapper);
    wrapper.innerHTML = '';
    const newClone = template.content.cloneNode(true);
    bindProps(newClone, updatedProps);
    bindEvents(newClone, updatedProps, methods);
    wrapper.appendChild(newClone);
  }

  function unmount() {
    if (wrapper._onUnmount) wrapper._onUnmount(wrapper);
    wrapper.remove();
  }

  return { element: wrapper, render, unmount };
}

function bindProps(clone, props) {
  for (const [key, value] of Object.entries(props)) {
    const textEl = clone.querySelector(`[data-prop="${key}"]`);
    if (textEl) textEl.textContent = value;
    const htmlEl = clone.querySelector(`[data-html="${key}"]`);
    if (htmlEl) htmlEl.innerHTML = value;
    clone.querySelectorAll(`[data-attr-${key}]`).forEach(el => {
      const attr = el.dataset[`attr${key.charAt(0).toUpperCase() + key.slice(1)}`];
      if (attr) el.setAttribute(attr, value);
    });
  }
}

function bindEvents(clone, props, methods) {
  clone.querySelectorAll('[data-on]').forEach(el => {
    const [event, handlerName] = el.dataset.on.split(':');
    const handler = methods[handlerName];
    if (handler) el.addEventListener(event, handler.bind(null, clone, props));
  });
}

export const MFW = {
  renderComponent
};