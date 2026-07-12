import exerciseNamesFr from '../data/exercise-names.fr.json';
import type { Exercise } from '../lib/data';
import type { Locale } from './types';

const exerciseNamesFrBySlug: Record<string, string> = exerciseNamesFr;

export function getExerciseName(exercise: Exercise, locale: Locale): string {
  if (locale === 'en') return exercise.name;
  return exerciseNamesFrBySlug[exercise.slug] ?? exercise.name;
}
