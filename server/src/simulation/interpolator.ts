// S-curve (smoothstep) interpolation for natural-feeling robot motion
export function smoothstep(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
}

// Interpolate a single axis toward target, returning the next value.
// Uses a trapezoidal velocity profile: accelerate, cruise, decelerate.
export function stepToward(
  current: number,
  target: number,
  maxDelta: number,
): number {
  const diff = target - current;
  if (Math.abs(diff) <= maxDelta) return target;
  return current + Math.sign(diff) * maxDelta;
}
