import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_SELECTION } from '@/components/effects/effect-utils';
import { STORAGE_KEY } from '@/utils/constants';

import { useEffectSelection, useEffectStore } from './effect.store';

/** Wrap a persisted selection the way Zustand `persist` serializes it. */
const persisted = (selection: string) =>
  JSON.stringify({ state: { selection }, version: 0 });

beforeEach(() => {
  localStorage.clear();
  useEffectStore.setState({ selection: DEFAULT_SELECTION });
});

afterEach(() => {
  localStorage.clear();
});

describe('effect store', () => {
  it('defaults to the auto selection', () => {
    expect(useEffectStore.getState().selection).toBe('auto');
  });

  it('updates and persists the selection', () => {
    act(() => useEffectStore.getState().setSelection('rain'));

    expect(useEffectStore.getState().selection).toBe('rain');
    expect(localStorage.getItem(STORAGE_KEY.EFFECT)).toContain('rain');
  });

  it('rehydrates a persisted selection', async () => {
    localStorage.setItem(STORAGE_KEY.EFFECT, persisted('off'));
    await useEffectStore.persist.rehydrate();
    expect(useEffectStore.getState().selection).toBe('off');
  });

  it('falls back to auto for an invalid persisted value', async () => {
    localStorage.setItem(STORAGE_KEY.EFFECT, persisted('rainbow'));
    await useEffectStore.persist.rehydrate();
    expect(useEffectStore.getState().selection).toBe('auto');
  });

  it('exposes the selection and setter via useEffectSelection', () => {
    const { result } = renderHook(() => useEffectSelection());
    expect(result.current.selection).toBe('auto');

    act(() => result.current.setSelection('leaves'));
    expect(useEffectStore.getState().selection).toBe('leaves');
  });
});
