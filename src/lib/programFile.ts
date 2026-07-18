import type { z } from 'zod';
import { checkGoalCompliance } from './calculations';
import { getExerciseById, getGoalById } from './data';
import type { TrainingGoal } from './data';
import { getExerciseName } from '../i18n/exerciseNames';
import { getGoalDefinition, getGoalKeyPrinciples, getGoalName } from '../i18n/labels';
import { t } from '../i18n/t';
import { DEFAULT_LOCALE, type Locale } from '../i18n/types';
import type { Program } from './types';

// zod is a heavy dependency (its runtime alone is several hundred kB
// minified) that's only actually needed when a program is exported/imported
// as JSON or hydrated from localStorage — never for the initial render of
// the page's single client:load island. Building the schemas lazily behind
// a memoized dynamic import keeps zod out of that island's eager bundle,
// which is what previously pushed it past the build's >500kB chunk-size
// warning threshold.
type ZodSchemas = ReturnType<typeof buildSchemas>;

function buildSchemas(z: typeof import('zod').z) {
  const ComplianceRuleSchema = z.object({
    id: z.string(),
    status: z.enum(['pass', 'fail']),
    message: z.string(),
  });

  const ProgramFileGoalSchema = z.object({
    id: z.string(),
    name: z.string(),
    definition: z.string(),
    keyPrinciples: z.array(z.string()),
  });

  const ProgramFileExerciseSchema = z.object({
    id: z.string(),
    exerciseId: z.string(),
    name: z.string(),
    sets: z.number().int().positive(),
    reps: z.string(),
    restSeconds: z.number().int().nonnegative(),
  });

  const ProgramFileSessionSchema = z.object({
    id: z.string(),
    name: z.string(),
    exercises: z.array(ProgramFileExerciseSchema),
  });

  const ProgramFileSchema = z.object({
    header: z.object({
      goal: ProgramFileGoalSchema,
      compliance: z.array(ComplianceRuleSchema),
    }),
    sessions: z.array(ProgramFileSessionSchema),
    marginMinutes: z.number().int().nonnegative().default(0),
  });

  const ProgramExerciseSchema = z.object({
    id: z.string(),
    exerciseId: z.string(),
    sets: z.number().int().positive(),
    reps: z.string(),
    restSeconds: z.number().int().nonnegative(),
  });

  const ProgramSessionSchema = z.object({
    id: z.string(),
    name: z.string(),
    exercises: z.array(ProgramExerciseSchema),
  });

  const ProgramSchema = z.object({
    goalId: z.string(),
    sessions: z.array(ProgramSessionSchema),
    marginMinutes: z.number().int().nonnegative().default(0),
  });

  return { ProgramFileSchema, ProgramSchema };
}

let schemasPromise: Promise<ZodSchemas> | null = null;

/** Loads zod and builds the schemas on first use, then reuses the same instances forever. */
export function getSchemas(): Promise<ZodSchemas> {
  schemasPromise ??= import('zod').then(({ z }) => buildSchemas(z));
  return schemasPromise;
}

export type ProgramFile = z.infer<Awaited<ReturnType<typeof getSchemas>>['ProgramFileSchema']>;

export async function buildProgramFile(
  program: Program,
  goal: TrainingGoal,
  locale: Locale = DEFAULT_LOCALE,
): Promise<ProgramFile> {
  const { ProgramFileSchema } = await getSchemas();

  const file: ProgramFile = {
    header: {
      goal: {
        id: goal.id,
        name: getGoalName(goal, locale),
        definition: getGoalDefinition(goal, locale),
        keyPrinciples: getGoalKeyPrinciples(goal, locale),
      },
      compliance: checkGoalCompliance(program, goal, locale),
    },
    sessions: program.sessions.map((session) => ({
      id: session.id,
      name: session.name,
      exercises: session.exercises.map((exercise) => {
        const definition = getExerciseById(exercise.exerciseId);
        return {
          id: exercise.id,
          exerciseId: exercise.exerciseId,
          name: definition ? getExerciseName(definition, locale) : exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          restSeconds: exercise.restSeconds,
        };
      }),
    })),
    marginMinutes: program.marginMinutes,
  };

  return ProgramFileSchema.parse(file);
}

function humanZodMessage(issue: z.core.$ZodIssue, locale: Locale = DEFAULT_LOCALE): string {
  switch (issue.code) {
    case 'invalid_type':
      return t(locale, 'zodError.invalid_type');
    case 'too_small':
      return t(locale, 'zodError.too_small');
    case 'too_big':
      return t(locale, 'zodError.too_big');
    case 'invalid_value':
      return t(locale, 'zodError.invalid_value');
    case 'unrecognized_keys':
      return t(locale, 'zodError.unrecognized_keys');
    default:
      return t(locale, 'zodError.default');
  }
}

export async function parseStoredProgram(json: unknown): Promise<Program | null> {
  const { ProgramSchema } = await getSchemas();
  const result = ProgramSchema.safeParse(json);
  if (!result.success) return null;

  const data = result.data;
  if (!getGoalById(data.goalId)) return null;

  for (const session of data.sessions) {
    for (const exercise of session.exercises) {
      if (!getExerciseById(exercise.exerciseId)) return null;
    }
  }

  return data;
}

export type ParseProgramFileResult = { ok: true; program: Program } | { ok: false; errors: string[] };

export async function parseProgramFile(json: unknown, locale: Locale = DEFAULT_LOCALE): Promise<ParseProgramFileResult> {
  const { ProgramFileSchema } = await getSchemas();
  const result = ProgramFileSchema.safeParse(json);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const path = issue.path.join('.') || '(root)';
      return `${path}: ${humanZodMessage(issue, locale)}`;
    });
    return { ok: false, errors };
  }

  const data = result.data;
  const errors: string[] = [];

  if (!getGoalById(data.header.goal.id)) {
    errors.push(t(locale, 'programFileError.unknownGoal', { id: data.header.goal.id }));
  }

  data.sessions.forEach((session, sessionIndex) => {
    session.exercises.forEach((exercise, exerciseIndex) => {
      if (!getExerciseById(exercise.exerciseId)) {
        errors.push(
          t(locale, 'programFileError.unknownExercise', {
            sessionIndex,
            exerciseIndex,
            id: exercise.exerciseId,
          }),
        );
      }
    });
  });

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    program: {
      goalId: data.header.goal.id,
      marginMinutes: data.marginMinutes,
      sessions: data.sessions.map((session) => ({
        id: session.id,
        name: session.name,
        exercises: session.exercises.map((exercise) => ({
          id: exercise.id,
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          restSeconds: exercise.restSeconds,
        })),
      })),
    },
  };
}
