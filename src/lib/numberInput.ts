/**
 * Rounds a raw <input type="number"> value and clamps it to a minimum,
 * falling back to that minimum for invalid/empty input (e.g. while the user
 * is still typing, or after clearing the field) instead of propagating NaN.
 */
export function clampRoundedInput(rawValue: string, min: number): number {
  const rounded = Math.round(Number(rawValue));
  return Math.max(min, Number.isNaN(rounded) ? min : rounded);
}
