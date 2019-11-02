/** Safely casts arg to type T. If arg is undefined, def is returned */
export function cast<T>(arg: T | undefined, def: T): T {
  if (typeof arg === 'undefined') return def;
  return arg;
}
