import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useEffectStore } from '@/store/effect.store';

import { DEFAULT_SELECTION } from './effect-utils';
import { useResolvedEffect } from './use-resolved-effect';

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  useEffectStore.setState({ selection: DEFAULT_SELECTION });
});

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});

describe('useResolvedEffect', () => {
  it('resolves null when off', () => {
    act(() => useEffectStore.setState({ selection: 'off' }));
    const { result } = renderHook(() => useResolvedEffect());
    expect(result.current).toBeNull();
  });

  it('resolves the seasonal effect when auto', () => {
    vi.setSystemTime(new Date(2026, 0, 15)); // January → snow
    const { result } = renderHook(() => useResolvedEffect());
    expect(result.current).toBe('snow');
  });

  it('resolves a specific manual selection unchanged', () => {
    vi.setSystemTime(new Date(2026, 0, 15)); // January, but manual wins
    act(() => useEffectStore.setState({ selection: 'leaves' }));
    const { result } = renderHook(() => useResolvedEffect());
    expect(result.current).toBe('leaves');
  });

  it('re-resolves the auto effect when the tab regains visibility', () => {
    vi.setSystemTime(new Date(2026, 0, 15)); // January → snow
    const { result } = renderHook(() => useResolvedEffect());
    expect(result.current).toBe('snow');

    // Cross into summer, then simulate the tab being refocused.
    vi.setSystemTime(new Date(2026, 6, 15)); // July → sun
    act(() => {
      vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current).toBe('sun');
  });
});
