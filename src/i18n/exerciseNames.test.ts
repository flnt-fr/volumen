import { describe, expect, it } from 'vitest';
import { exercises } from '../lib/data';
import { getExerciseName } from './exerciseNames';

describe('getExerciseName', () => {
  it('always returns the English name for the en locale', () => {
    const exercise = exercises[0];
    expect(getExerciseName(exercise, 'en')).toBe(exercise.name);
  });

  it('falls back to the English name when no French translation exists', () => {
    const exercise = { ...exercises[0], slug: 'this-slug-does-not-exist' };
    expect(getExerciseName(exercise, 'fr')).toBe(exercise.name);
  });
});
