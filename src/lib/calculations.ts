import { getExerciseById, primaryMuscles } from './data';
import type { TrainingGoal } from './data';
import { getExerciseName } from '../i18n/exerciseNames';
import { getMuscleLabel } from '../i18n/labels';
import { t } from '../i18n/t';
import { DEFAULT_LOCALE, type Locale } from '../i18n/types';
import type { Program, ProgramExercise, Session } from './types';

export interface MuscleSetCounts {
  primary: Record<string, number>;
  secondary: Record<string, number>;
}

function addSets(counts: Record<string, number>, muscles: string[], sets: number) {
  for (const muscle of muscles) {
    counts[muscle] = (counts[muscle] ?? 0) + sets;
  }
}

export function setsByMuscle(session: Session): MuscleSetCounts {
  const counts: MuscleSetCounts = { primary: {}, secondary: {} };

  for (const programExercise of session.exercises) {
    const exercise = getExerciseById(programExercise.exerciseId);
    if (!exercise) continue;
    addSets(counts.primary, exercise.primaryMuscles, programExercise.sets);
    addSets(counts.secondary, exercise.secondaryMuscles, programExercise.sets);
  }

  return counts;
}

export function setsByMuscleForProgram(program: Program): MuscleSetCounts {
  const total: MuscleSetCounts = { primary: {}, secondary: {} };

  for (const session of program.sessions) {
    const sessionCounts = setsByMuscle(session);
    for (const [muscle, sets] of Object.entries(sessionCounts.primary)) {
      total.primary[muscle] = (total.primary[muscle] ?? 0) + sets;
    }
    for (const [muscle, sets] of Object.entries(sessionCounts.secondary)) {
      total.secondary[muscle] = (total.secondary[muscle] ?? 0) + sets;
    }
  }

  return total;
}

/**
 * Secondary (synergist) muscle involvement counts for half a direct set.
 * This "fractional set counting" convention — 1.0 for the primary/direct
 * mover, 0.5 for secondary/indirect involvement — is the weighting a 2025
 * meta-analysis across 67 studies found to best predict hypertrophy
 * outcomes, and matches the convention used by RP Strength-style volume
 * trackers (e.g. bench press = 1.0 set chest, 0.5 set triceps/front delts).
 */
export const SECONDARY_MUSCLE_WEIGHT = 0.5;

export interface MuscleGroupVolume {
  primary: number;
  secondary: number;
  weighted: number;
}

function weightedVolumeByMuscle(counts: MuscleSetCounts): Record<string, MuscleGroupVolume> {
  const muscles = new Set([...Object.keys(counts.primary), ...Object.keys(counts.secondary)]);
  const result: Record<string, MuscleGroupVolume> = {};
  for (const muscle of muscles) {
    const primary = counts.primary[muscle] ?? 0;
    const secondary = counts.secondary[muscle] ?? 0;
    result[muscle] = { primary, secondary, weighted: primary + secondary * SECONDARY_MUSCLE_WEIGHT };
  }
  return result;
}

export function formatSets(value: number, locale: Locale = DEFAULT_LOCALE): string {
  if (Number.isInteger(value)) return String(value);
  return locale === 'fr' ? value.toFixed(1).replace('.', ',') : value.toFixed(1);
}

export type RuleStatus = 'pass' | 'fail';

export interface ComplianceRule {
  id: string;
  status: RuleStatus;
  message: string;
}

export function goalHasVolumeRule(goal: TrainingGoal): boolean {
  return Boolean(goal.volume?.setsPerExercise || goal.volume?.setsPerMuscleGroupPerWeek);
}

export function checkGoalCompliance(
  program: Program,
  goal: TrainingGoal,
  locale: Locale = DEFAULT_LOCALE,
): ComplianceRule[] {
  const rules: ComplianceRule[] = [];

  const setsPerExercise = goal.volume?.setsPerExercise;
  if (setsPerExercise) {
    for (const session of program.sessions) {
      for (const programExercise of session.exercises) {
        const exercise = getExerciseById(programExercise.exerciseId);
        const label = exercise ? getExerciseName(exercise, locale) : programExercise.exerciseId;
        const inRange =
          programExercise.sets >= setsPerExercise.min && programExercise.sets <= setsPerExercise.max;
        const params = {
          label,
          session: session.name,
          sets: programExercise.sets,
          min: setsPerExercise.min,
          max: setsPerExercise.max,
        };
        rules.push({
          id: `setsPerExercise:${programExercise.id}`,
          status: inRange ? 'pass' : 'fail',
          message: inRange
            ? t(locale, 'compliance.setsPerExercise.pass', params)
            : t(locale, 'compliance.setsPerExercise.fail', params),
        });
      }
    }
  }

  const sessionsPerWeekMin = goal.frequency?.sessionsPerWeekMin;
  if (sessionsPerWeekMin !== undefined) {
    const sessionCount = program.sessions.length;
    const enough = sessionCount >= sessionsPerWeekMin;
    const params = { count: sessionCount, min: sessionsPerWeekMin };
    rules.push({
      id: 'sessionsPerWeekMin',
      status: enough ? 'pass' : 'fail',
      message: enough
        ? t(locale, 'compliance.sessionsPerWeek.pass', params)
        : t(locale, 'compliance.sessionsPerWeek.fail', params),
    });
  }

  const setsPerMuscleGroupPerWeek = goal.volume?.setsPerMuscleGroupPerWeek;
  if (setsPerMuscleGroupPerWeek) {
    const volumes = weightedVolumeByMuscle(setsByMuscleForProgram(program));
    for (const [muscle, volume] of Object.entries(volumes)) {
      const enough = volume.weighted >= setsPerMuscleGroupPerWeek.min;
      const params = {
        muscle: getMuscleLabel(muscle, locale),
        primary: volume.primary,
        secondary: volume.secondary,
        weighted: formatSets(volume.weighted, locale),
        min: setsPerMuscleGroupPerWeek.min,
      };
      rules.push({
        id: `setsPerMuscleGroupPerWeek:${muscle}`,
        status: enough ? 'pass' : 'fail',
        message: enough
          ? t(locale, 'compliance.setsPerMuscleGroup.pass', params)
          : t(locale, 'compliance.setsPerMuscleGroup.fail', params),
      });
    }
  }

  return rules;
}

export interface ExerciseMuscleContribution {
  id: string;
  label: string;
  sets: number;
  primaryMuscles: string;
  secondaryMuscles: string;
  secondaryWeightedSets: number;
}

export function exerciseMuscleContributions(
  session: Session,
  locale: Locale = DEFAULT_LOCALE,
): ExerciseMuscleContribution[] {
  const contributions: ExerciseMuscleContribution[] = [];

  for (const programExercise of session.exercises) {
    const exercise = getExerciseById(programExercise.exerciseId);
    if (!exercise) continue;

    contributions.push({
      id: programExercise.id,
      label: getExerciseName(exercise, locale),
      sets: programExercise.sets,
      primaryMuscles: exercise.primaryMuscles.map((muscle) => getMuscleLabel(muscle, locale)).join(', '),
      secondaryMuscles: exercise.secondaryMuscles.map((muscle) => getMuscleLabel(muscle, locale)).join(', '),
      secondaryWeightedSets: programExercise.sets * SECONDARY_MUSCLE_WEIGHT,
    });
  }

  return contributions;
}

export interface MuscleGroupVolumeStatus {
  muscle: string;
  primarySets: number;
  secondarySets: number;
  weightedSets: number;
  min: number;
  status: RuleStatus;
}

/**
 * Average concentric+eccentric tempo used to estimate rep-execution time.
 */
const SECONDS_PER_REP = 4;
/**
 * Fallback average reps when the free-text reps field can't be parsed (e.g. "AMRAP").
 */
const DEFAULT_REPS = 10;
/**
 * Average time to walk to the next machine/station and adjust its settings
 * (seat height, pins, loaded plates), counted once per exercise.
 */
export const EQUIPMENT_CHANGE_SECONDS = 60;

export function parseAverageReps(reps: string): number {
  const matches = reps.match(/\d+/g);
  if (!matches) return DEFAULT_REPS;
  if (matches.length === 1) return Number(matches[0]);
  return (Number(matches[0]) + Number(matches[1])) / 2;
}

export function exerciseEstimatedSeconds(exercise: ProgramExercise): number {
  return (
    exercise.sets * (parseAverageReps(exercise.reps) * SECONDS_PER_REP + exercise.restSeconds) +
    EQUIPMENT_CHANGE_SECONDS
  );
}

export function sessionEstimatedSeconds(session: Session): number {
  return session.exercises.reduce((total, exercise) => total + exerciseEstimatedSeconds(exercise), 0);
}

export function programEstimatedSeconds(program: Program): number {
  return program.sessions.reduce(
    (total, session) => total + sessionEstimatedSeconds(session) + program.marginMinutes * 60,
    0,
  );
}

export function formatDuration(totalSeconds: number, locale: Locale = DEFAULT_LOCALE): string {
  const totalMinutes = Math.round(totalSeconds / 60);
  if (totalMinutes < 60) {
    return t(locale, 'time.minutesOnly', { minutes: totalMinutes });
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return t(locale, 'time.hoursMinutes', { hours, minutes });
}

export function muscleGroupVolumeStatus(program: Program, goal: TrainingGoal): MuscleGroupVolumeStatus[] {
  const rule = goal.volume?.setsPerMuscleGroupPerWeek;
  if (!rule) return [];

  const volumes = weightedVolumeByMuscle(setsByMuscleForProgram(program));
  return primaryMuscles.map((muscle) => {
    const volume = volumes[muscle] ?? { primary: 0, secondary: 0, weighted: 0 };
    return {
      muscle,
      primarySets: volume.primary,
      secondarySets: volume.secondary,
      weightedSets: volume.weighted,
      min: rule.min,
      status: volume.weighted >= rule.min ? 'pass' : 'fail',
    };
  });
}
