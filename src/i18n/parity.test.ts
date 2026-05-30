import { describe, expect, it } from 'vitest';

import { resources } from './resources';

function flatKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object'
      ? flatKeys(value as Record<string, unknown>, path)
      : [path];
  });
}

const namespaces = Object.keys(resources.en) as (keyof typeof resources.en)[];

describe('locale key parity (en/vi)', () => {
  it.each(namespaces)('namespace "%s" has matching keys', (ns) => {
    const en = flatKeys(resources.en[ns]).sort();
    const vi = flatKeys(resources.vi[ns]).sort();
    expect(vi).toEqual(en);
  });
});
