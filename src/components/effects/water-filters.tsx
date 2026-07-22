/**
 * SVG Filter for water refraction (distortion).
 * Used by the mt-effect-water-refraction class in style.css.
 */
export function WaterFilters() {
  return (
    <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
      <defs>
        <filter id="mt-water-refraction">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="3"
            seed="1"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="20s"
              values="0.012;0.015;0.012"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
        </filter>
      </defs>
    </svg>
  );
}
