export { controller } from './controller.js';
export { resolveComponent } from './helpers.js';
export { defineFileRoutes } from './router.js';
export { store } from './store.js'; // Optional, non-core

export const MFW = {
  controller,
  resolveComponent,
  defineFileRoutes,
  store,
};