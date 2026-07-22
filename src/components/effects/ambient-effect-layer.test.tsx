import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useEffectStore } from '@/store/effect.store';

import { AmbientEffectLayer } from './ambient-effect-layer';
import { DEFAULT_SELECTION } from './effect-utils';

/** Stub matchMedia so usePrefersReducedMotion can be controlled per test. */
function mockMatchMedia(reduced: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? reduced : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

beforeEach(() => {
  localStorage.clear();
  useEffectStore.setState({ selection: DEFAULT_SELECTION });
  // No real 2D context in jsdom; the canvas element still renders.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('AmbientEffectLayer', () => {
  it('renders a canvas for an active particle effect', () => {
    mockMatchMedia(false);
    useEffectStore.setState({ selection: 'snow' });
    const { container } = render(<AmbientEffectLayer />);
    expect(container.querySelector('canvas')).not.toBeNull();
    expect(container.querySelector('[data-effect="snow"]')).not.toBeNull();
  });

  it.each(['rain', 'leaves'] as const)(
    'renders a canvas for the %s particle effect',
    (effect) => {
      mockMatchMedia(false);
      useEffectStore.setState({ selection: effect });
      const { container } = render(<AmbientEffectLayer />);
      expect(container.querySelector('canvas')).not.toBeNull();
      expect(
        container.querySelector(`[data-effect="${effect}"]`),
      ).not.toBeNull();
    },
  );

  it('renders a CSS layer (not a canvas) for the sun effect', () => {
    mockMatchMedia(false);
    useEffectStore.setState({ selection: 'sun' });
    const { container } = render(<AmbientEffectLayer />);
    expect(container.querySelector('canvas')).toBeNull();
    expect(container.querySelector('.mt-effect-sun')).not.toBeNull();
    expect(container.querySelector('[data-effect="sun"]')).not.toBeNull();
  });

  it('renders a canvas for the water effect', () => {
    mockMatchMedia(false);
    useEffectStore.setState({ selection: 'water' });
    const { container } = render(<AmbientEffectLayer />);
    expect(container.querySelector('canvas')).not.toBeNull();
    expect(container.querySelector('[data-effect="water"]')).not.toBeNull();
  });

  it('renders a canvas for the ink effect', () => {
    mockMatchMedia(false);
    useEffectStore.setState({ selection: 'ink' });
    const { container } = render(<AmbientEffectLayer />);
    expect(container.querySelector('canvas')).not.toBeNull();
    expect(container.querySelector('[data-effect="ink"]')).not.toBeNull();
  });

  it('renders a canvas for the aurora effect', () => {
    mockMatchMedia(false);
    useEffectStore.setState({ selection: 'aurora' });
    const { container } = render(<AmbientEffectLayer />);
    expect(container.querySelector('canvas')).not.toBeNull();
    expect(container.querySelector('[data-effect="aurora"]')).not.toBeNull();
  });

  it('renders a canvas for the nebula effect', () => {
    mockMatchMedia(false);
    useEffectStore.setState({ selection: 'nebula' });
    const { container } = render(<AmbientEffectLayer />);
    expect(container.querySelector('canvas')).not.toBeNull();
    expect(container.querySelector('[data-effect="nebula"]')).not.toBeNull();
  });

  it('renders nebula even when the user prefers reduced motion', () => {
    mockMatchMedia(true);
    useEffectStore.setState({ selection: 'nebula' });
    const { container } = render(<AmbientEffectLayer />);
    expect(container.querySelector('canvas')).not.toBeNull();
    expect(container.querySelector('[data-effect="nebula"]')).not.toBeNull();
  });

  it('renders nothing when the effect is off', () => {
    mockMatchMedia(false);
    useEffectStore.setState({ selection: 'off' });
    const { container } = render(<AmbientEffectLayer />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when the user prefers reduced motion', () => {
    mockMatchMedia(true);
    useEffectStore.setState({ selection: 'snow' });
    const { container } = render(<AmbientEffectLayer />);
    expect(container.firstChild).toBeNull();
  });
});
