import { cn } from '@/lib/utils';

import { CSS_EFFECT_CLASSES, PARTICLE_CONFIGS } from './effect-configs';
import { getEffectById } from './effect-utils';
import { NebulaCanvas } from './nebula-canvas';
import { ParticleCanvas } from './particle-canvas';
import { usePrefersReducedMotion } from './use-prefers-reduced-motion';
import { useResolvedEffect } from './use-resolved-effect';
import { WaterCanvas } from './water-canvas';
import { WaterFilters } from './water-filters';

/**
 * Full-app ambient effect overlay.
 *
 * Fixed, `pointer-events-none` and `aria-hidden` so it never intercepts input
 * or screen readers. Sits below the floating UI / modals / toasts (which are at
 * `z-50`). Renders nothing when no effect is active or the user prefers reduced
 * motion. Particle effects mount a `<canvas>`; CSS effects (sun) mount a styled
 * layer div.
 */
export function AmbientEffectLayer() {
  const effect = useResolvedEffect();
  const reducedMotion = usePrefersReducedMotion();

  if (!effect) return null;

  const definition = getEffectById(effect);
  const particle = PARTICLE_CONFIGS[effect];
  const cssClass = CSS_EFFECT_CLASSES[effect];

  if (reducedMotion && definition.kind !== 'nebula') return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
      aria-hidden="true"
      data-effect={effect}
    >
      {definition.kind === 'particle' && particle && (
        <ParticleCanvas spec={particle} />
      )}
      {definition.kind === 'water' && (
        <>
          <WaterFilters />
          <div className="mt-effect-water-refraction absolute inset-0" />
          <WaterCanvas />
        </>
      )}
      {definition.kind === 'nebula' && <NebulaCanvas />}
      {definition.kind === 'css' && cssClass && (
        <div className={cn('absolute inset-0', cssClass)} />
      )}
    </div>
  );
}
