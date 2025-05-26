export interface RenderOptions {
  onMount?: (el: HTMLElement) => void;
  onUnmount?: (el: HTMLElement) => void;
}

export interface RenderResult {
  element: HTMLElement;
  render: (updatedProps?: Record<string, any>) => void;
  unmount: () => void;
}

export function renderComponent(
  name: string,
  targetEl: HTMLElement,
  props?: Record<string, any>,
  methods?: Record<string, Function>,
  options?: RenderOptions
): Promise<RenderResult>;

export const MFW: {
  renderComponent: typeof renderComponent;
};
