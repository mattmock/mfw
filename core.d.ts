import type { RequestHandler } from 'express';

/**
 * Creates an Express middleware that maps URL paths to view components.
 */
export function defineFileRoutes(
  viewDirPath: string,
  options?: {
    root?: string;
    notFound?: string;
  }
): RequestHandler;

/**
 * Dynamically loads a view component module from a given directory.
 */
export function resolveComponent(
  name: string,
  viewDirPath: string
): Promise<string>;

/**
 * Wraps an async Express route handler with error handling.
 */
export function controller(
  fn: (req: any, res: any) => Promise<any>
): RequestHandler;

/**
 * A minimal mutable state store (optional).
 */
export function store<T>(
  initial: T
): {
  get: () => T;
  set: (value: T) => void;
  update: (fn: (value: T) => T) => void;
  subscribe: (fn: (value: T) => void) => () => void;
};

export const MFW: {
  defineFileRoutes: typeof defineFileRoutes;
  resolveComponent: typeof resolveComponent;
  controller: typeof controller;
  store: typeof store;
};
