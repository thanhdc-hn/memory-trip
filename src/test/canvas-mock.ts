/**
 * Test helper: a recording stand-in for `CanvasRenderingContext2D` (jsdom has no
 * canvas). Every method call is logged together with a snapshot of the context
 * state at that moment, and `save` / `restore` are emulated so assertions can
 * check e.g. "which fillStyle / shadow was active when this was filled".
 */
export interface CanvasCall {
  name: string;
  args: unknown[];
  state: Record<string, unknown>;
}

export function createCanvasMock() {
  const calls: CanvasCall[] = [];
  const stack: Record<string, unknown>[] = [];
  let state: Record<string, unknown> = {};

  const record = (name: string, args: unknown[]) =>
    calls.push({ name, args, state: { ...state } });

  const ctx = new Proxy({} as Record<string, unknown>, {
    get(_target, prop: string) {
      if (prop in state) return state[prop];
      return (...args: unknown[]) => {
        if (prop === 'save') stack.push({ ...state });
        if (prop === 'restore') state = stack.pop() ?? {};
        record(prop, args);
        if (prop === 'measureText')
          return { width: String(args[0]).length * 8 };
        if (
          prop === 'createLinearGradient' ||
          prop === 'createRadialGradient'
        ) {
          return {
            addColorStop: (at: number, color: string) =>
              record('addColorStop', [at, color]),
          };
        }
        return undefined;
      };
    },
    set(_target, prop: string, value: unknown) {
      state[prop] = value;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;

  return {
    ctx,
    calls,
    named: (name: string) => calls.filter((c) => c.name === name),
  };
}
