export function store(initial) {
    let value = initial;
    const subscribers = new Set();
    return {
      get: () => value,
      set: (v) => { value = v; subscribers.forEach(fn => fn(value)); },
      update: (fn) => { value = fn(value); subscribers.forEach(fn => fn(value)); },
      subscribe: (fn) => { subscribers.add(fn); return () => subscribers.delete(fn); }
    };
  }  