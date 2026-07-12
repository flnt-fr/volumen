import { describe, expect, it } from 'vitest';
import {
  checkGoalCompliance,
  EQUIPMENT_CHANGE_SECONDS,
  exerciseEstimatedSeconds,
  exerciseMuscleContributions,
  formatDuration,
  goalHasVolumeRule,
  muscleGroupVolumeStatus,
  parseAverageReps,
  programEstimatedSeconds,
  sessionEstimatedSeconds,
  setsByMuscle,
  setsByMuscleForProgram,
} from './calculations';
import { exercises, getGoalById, primaryMuscles } from './data';
import type { Program, ProgramExercise, Session } from './types';

function findExercise(predicate: (e: (typeof exercises)[number]) => boolean) {
  const exercise = exercises.find(predicate);
  if (!exercise) throw new Error('fixture exercise not found');
  return exercise;
}

function programExercise(
  exerciseId: string,
  sets: number,
  id = exerciseId,
  overrides: Partial<Pick<ProgramExercise, 'reps' | 'restSeconds'>> = {},
) {
  return { id, exerciseId, sets, reps: '8-12', restSeconds: 90, ...overrides };
}

describe('setsByMuscle', () => {
  it('counts sets by primary and secondary muscle for one session', () => {
    const exerciseA = findExercise((e) => e.primaryMuscles.includes('chest') && e.secondaryMuscles.length > 0);
    const exerciseB = findExercise((e) => e.primaryMuscles.includes('chest') && e.id !== exerciseA.id);

    const session: Session = {
      id: 's1',
      name: 'Session A',
      exercises: [programExercise(exerciseA.id, 3, 'pe1'), programExercise(exerciseB.id, 4, 'pe2')],
    };

    const counts = setsByMuscle(session);

    expect(counts.primary.chest).toBe(7);
    for (const muscle of exerciseA.secondaryMuscles) {
      expect(counts.secondary[muscle]).toBeGreaterThanOrEqual(3);
    }
  });

  it('ignores unknown exerciseId', () => {
    const session: Session = {
      id: 's1',
      name: 'Session A',
      exercises: [programExercise('unknown-id', 3)],
    };

    expect(setsByMuscle(session)).toEqual({ primary: {}, secondary: {} });
  });
});

describe('setsByMuscleForProgram', () => {
  it('sums sets across all sessions', () => {
    const exerciseA = findExercise((e) => e.primaryMuscles.includes('chest'));
    const program: Program = {
      goalId: 'hypertrophy',
      marginMinutes: 0,
      sessions: [
        { id: 's1', name: 'Session 1', exercises: [programExercise(exerciseA.id, 3, 'pe1')] },
        { id: 's2', name: 'Session 2', exercises: [programExercise(exerciseA.id, 4, 'pe2')] },
      ],
    };

    expect(setsByMuscleForProgram(program).primary.chest).toBe(7);
  });
});

describe('checkGoalCompliance', () => {
  it('strength: passes when every exercise is within range and enough sessions exist', () => {
    const goal = getGoalById('strength')!;
    const exerciseA = findExercise((e) => e.primaryMuscles.length > 0);
    const program: Program = {
      goalId: 'strength',
      marginMinutes: 0,
      sessions: [
        { id: 's1', name: 'Session 1', exercises: [programExercise(exerciseA.id, 3, 'pe1')] },
        { id: 's2', name: 'Session 2', exercises: [programExercise(exerciseA.id, 2, 'pe2')] },
      ],
    };

    const rules = checkGoalCompliance(program, goal);
    expect(rules.length).toBeGreaterThan(0);
    expect(rules.every((rule) => rule.status === 'pass')).toBe(true);
  });

  it('strength: fails when an exercise is outside the sets range or sessions are too few', () => {
    const goal = getGoalById('strength')!;
    const exerciseA = findExercise((e) => e.primaryMuscles.length > 0);
    const program: Program = {
      goalId: 'strength',
      marginMinutes: 0,
      sessions: [{ id: 's1', name: 'Session 1', exercises: [programExercise(exerciseA.id, 10, 'pe1')] }],
    };

    const rules = checkGoalCompliance(program, goal);
    expect(rules.some((rule) => rule.status === 'fail')).toBe(true);
  });

  it('hypertrophy: passes when cumulated sets per primary muscle reach the minimum', () => {
    const goal = getGoalById('hypertrophy')!;
    const exerciseA = findExercise((e) => e.primaryMuscles.includes('chest'));
    const program: Program = {
      goalId: 'hypertrophy',
      marginMinutes: 0,
      sessions: [
        { id: 's1', name: 'Session 1', exercises: [programExercise(exerciseA.id, 6, 'pe1')] },
        { id: 's2', name: 'Session 2', exercises: [programExercise(exerciseA.id, 6, 'pe2')] },
      ],
    };

    const rules = checkGoalCompliance(program, goal);
    const chestRule = rules.find((rule) => rule.id === 'setsPerMuscleGroupPerWeek:chest');
    expect(chestRule?.status).toBe('pass');
  });

  it('hypertrophy: fails when cumulated sets per primary muscle stay below the minimum', () => {
    const goal = getGoalById('hypertrophy')!;
    const exerciseA = findExercise((e) => e.primaryMuscles.includes('chest'));
    const program: Program = {
      goalId: 'hypertrophy',
      marginMinutes: 0,
      sessions: [{ id: 's1', name: 'Session 1', exercises: [programExercise(exerciseA.id, 2, 'pe1')] }],
    };

    const rules = checkGoalCompliance(program, goal);
    const chestRule = rules.find((rule) => rule.id === 'setsPerMuscleGroupPerWeek:chest');
    expect(chestRule?.status).toBe('fail');
  });

  it('hypertrophy: credits secondary-muscle involvement at half weight', () => {
    const goal = getGoalById('hypertrophy')!;
    // Barbell Bench Press - Medium Grip: primary chest, secondary shoulders + triceps.
    const benchPress = findExercise((e) => e.name === 'Barbell Bench Press - Medium Grip');
    const program: Program = {
      goalId: 'hypertrophy',
      marginMinutes: 0,
      sessions: [{ id: 's1', name: 'Session 1', exercises: [programExercise(benchPress.id, 20, 'pe1')] }],
    };

    const rules = checkGoalCompliance(program, goal);

    // 20 direct sets for chest, well above the minimum of 10.
    const chestRule = rules.find((rule) => rule.id === 'setsPerMuscleGroupPerWeek:chest');
    expect(chestRule?.status).toBe('pass');
    expect(chestRule?.message).toContain('20 direct + 0 secondary');

    // 0 direct + 20 secondary set(s) x 0.5 = 10 weighted sets, exactly the minimum.
    const tricepsRule = rules.find((rule) => rule.id === 'setsPerMuscleGroupPerWeek:triceps');
    expect(tricepsRule?.status).toBe('pass');
    expect(tricepsRule?.message).toContain('0 direct + 20 secondary set(s) × 0.5 = 10 weighted set(s)');
  });

  it('hypertrophy: secondary-muscle involvement alone is not enough below the weighted minimum', () => {
    const goal = getGoalById('hypertrophy')!;
    const benchPress = findExercise((e) => e.name === 'Barbell Bench Press - Medium Grip');
    const program: Program = {
      goalId: 'hypertrophy',
      marginMinutes: 0,
      sessions: [{ id: 's1', name: 'Session 1', exercises: [programExercise(benchPress.id, 10, 'pe1')] }],
    };

    const rules = checkGoalCompliance(program, goal);
    const tricepsRule = rules.find((rule) => rule.id === 'setsPerMuscleGroupPerWeek:triceps');
    expect(tricepsRule?.status).toBe('fail');
    expect(tricepsRule?.message).toContain('0 direct + 10 secondary set(s) × 0.5 = 5 weighted set(s)');
  });

  it('power: has no volume rule regardless of program content', () => {
    const goal = getGoalById('power')!;
    const exerciseA = findExercise((e) => e.primaryMuscles.length > 0);
    const program: Program = {
      goalId: 'power',
      marginMinutes: 0,
      sessions: [{ id: 's1', name: 'Session 1', exercises: [programExercise(exerciseA.id, 20, 'pe1')] }],
    };

    expect(checkGoalCompliance(program, goal)).toEqual([]);
  });

  it('generalHealthMovement: has no volume rule regardless of program content', () => {
    const goal = getGoalById('generalHealthMovement')!;
    const program: Program = { goalId: 'generalHealthMovement', sessions: [], marginMinutes: 0 };

    expect(checkGoalCompliance(program, goal)).toEqual([]);
  });

  it('generates messages in the requested locale', () => {
    const goal = getGoalById('strength')!;
    const program: Program = { goalId: 'strength', sessions: [], marginMinutes: 0 };

    const rules = checkGoalCompliance(program, goal, 'fr');
    const sessionsRule = rules.find((rule) => rule.id === 'sessionsPerWeekMin');
    expect(sessionsRule?.message).toContain('séance(s)');
  });
});

describe('goalHasVolumeRule', () => {
  it('is true for hypertrophy, which only defines setsPerMuscleGroupPerWeek', () => {
    const goal = getGoalById('hypertrophy')!;
    expect(goalHasVolumeRule(goal)).toBe(true);
  });

  it('is true for strength, which defines setsPerExercise', () => {
    const goal = getGoalById('strength')!;
    expect(goalHasVolumeRule(goal)).toBe(true);
  });

  it('is false for power, which has no volume rule at all', () => {
    const goal = getGoalById('power')!;
    expect(goalHasVolumeRule(goal)).toBe(false);
  });

  it('is false for generalHealthMovement, which has no volume rule at all', () => {
    const goal = getGoalById('generalHealthMovement')!;
    expect(goalHasVolumeRule(goal)).toBe(false);
  });
});

describe('muscleGroupVolumeStatus', () => {
  it('hypertrophy: returns one entry per primary muscle, including muscles with 0 sets', () => {
    const goal = getGoalById('hypertrophy')!;
    const benchPress = findExercise((e) => e.name === 'Barbell Bench Press - Medium Grip');
    const program: Program = {
      goalId: 'hypertrophy',
      marginMinutes: 0,
      sessions: [
        { id: 's1', name: 'Session 1', exercises: [programExercise(benchPress.id, 6, 'pe1')] },
        { id: 's2', name: 'Session 2', exercises: [programExercise(benchPress.id, 6, 'pe2')] },
      ],
    };

    const rows = muscleGroupVolumeStatus(program, goal);
    expect(rows).toHaveLength(primaryMuscles.length);

    const chestRow = rows.find((row) => row.muscle === 'chest');
    expect(chestRow).toEqual({ muscle: 'chest', primarySets: 12, secondarySets: 0, weightedSets: 12, min: 10, status: 'pass' });

    // Triceps only gets secondary credit from this exercise: 12 * 0.5 = 6, still below the minimum of 10.
    const tricepsRow = rows.find((row) => row.muscle === 'triceps');
    expect(tricepsRow).toEqual({ muscle: 'triceps', primarySets: 0, secondarySets: 12, weightedSets: 6, min: 10, status: 'fail' });

    const untouchedRow = rows.find((row) => row.muscle === 'calves');
    expect(untouchedRow).toEqual({ muscle: 'calves', primarySets: 0, secondarySets: 0, weightedSets: 0, min: 10, status: 'fail' });
  });

  it('strength: has no muscle-group volume rule, returns an empty list', () => {
    const goal = getGoalById('strength')!;
    const program: Program = { goalId: 'strength', sessions: [], marginMinutes: 0 };

    expect(muscleGroupVolumeStatus(program, goal)).toEqual([]);
  });
});

describe('exerciseMuscleContributions', () => {
  it('reports the direct primary sets and the weighted secondary sets for each exercise', () => {
    // Barbell Bench Press - Medium Grip: primary chest, secondary shoulders + triceps.
    const benchPress = findExercise((e) => e.name === 'Barbell Bench Press - Medium Grip');
    const session: Session = {
      id: 's1',
      name: 'Session 1',
      exercises: [programExercise(benchPress.id, 4, 'pe1')],
    };

    const contributions = exerciseMuscleContributions(session);
    expect(contributions).toHaveLength(1);
    expect(contributions[0]).toEqual({
      id: 'pe1',
      label: 'Barbell Bench Press - Medium Grip',
      sets: 4,
      primaryMuscles: 'chest',
      secondaryMuscles: 'shoulders, triceps',
      secondaryWeightedSets: 2,
    });
  });

  it('reports an empty secondary-muscles string for exercises with no secondary muscles', () => {
    const isolationExercise = findExercise((e) => e.secondaryMuscles.length === 0);
    const session: Session = {
      id: 's1',
      name: 'Session 1',
      exercises: [programExercise(isolationExercise.id, 3, 'pe1')],
    };

    const contributions = exerciseMuscleContributions(session);
    expect(contributions[0].secondaryMuscles).toBe('');
    expect(contributions[0].secondaryWeightedSets).toBe(1.5);
  });

  it('ignores unknown exerciseId', () => {
    const session: Session = {
      id: 's1',
      name: 'Session 1',
      exercises: [programExercise('unknown-id', 3)],
    };

    expect(exerciseMuscleContributions(session)).toEqual([]);
  });
});

describe('parseAverageReps', () => {
  it('returns the single number when reps is a plain integer', () => {
    expect(parseAverageReps('10')).toBe(10);
  });

  it('averages the first two numbers found in a range', () => {
    expect(parseAverageReps('8-12')).toBe(10);
  });

  it('averages the first two numbers found in a "X to Y" range', () => {
    expect(parseAverageReps('8 to 12')).toBe(10);
  });

  it('falls back to the default when no number can be parsed', () => {
    expect(parseAverageReps('AMRAP')).toBe(10);
  });

  it('averages only the first two numbers when more than two are present', () => {
    expect(parseAverageReps('8-12-15')).toBe(10);
  });
});

describe('exerciseEstimatedSeconds', () => {
  it('computes sets * (avgReps * secondsPerRep + restSeconds) + equipmentChangeSeconds', () => {
    const exercise = programExercise('some-id', 3, 'pe1', { reps: '8-12', restSeconds: 90 });
    // 3 * (10 * 4 + 90) + 60 = 3 * 130 + 60 = 450
    expect(exerciseEstimatedSeconds(exercise)).toBe(450);
  });

  it('uses the default reps fallback for unparseable rep text', () => {
    const exercise = programExercise('some-id', 2, 'pe1', { reps: 'AMRAP', restSeconds: 60 });
    // 2 * (10 * 4 + 60) + 60 = 2 * 100 + 60 = 260
    expect(exerciseEstimatedSeconds(exercise)).toBe(260);
  });

  it('adds the equipment change/setup time exactly once, regardless of set count', () => {
    const oneSet = programExercise('some-id', 1, 'pe1', { reps: '10', restSeconds: 0 });
    const fiveSets = programExercise('some-id', 5, 'pe2', { reps: '10', restSeconds: 0 });

    expect(exerciseEstimatedSeconds(oneSet)).toBe(1 * 10 * 4 + EQUIPMENT_CHANGE_SECONDS);
    expect(exerciseEstimatedSeconds(fiveSets)).toBe(5 * 10 * 4 + EQUIPMENT_CHANGE_SECONDS);
  });
});

describe('sessionEstimatedSeconds', () => {
  it('sums estimated seconds across all exercises in the session', () => {
    const session: Session = {
      id: 's1',
      name: 'Session 1',
      exercises: [
        programExercise('e1', 3, 'pe1', { reps: '8-12', restSeconds: 90 }),
        programExercise('e2', 2, 'pe2', { reps: '10', restSeconds: 60 }),
      ],
    };

    // pe1: 3 * (10*4 + 90) + 60 = 450, pe2: 2 * (10*4 + 60) + 60 = 260
    expect(sessionEstimatedSeconds(session)).toBe(710);
  });
});

describe('programEstimatedSeconds', () => {
  it('sums session estimates plus a per-session margin', () => {
    const program: Program = {
      goalId: 'hypertrophy',
      marginMinutes: 5,
      sessions: [
        {
          id: 's1',
          name: 'Session 1',
          exercises: [programExercise('e1', 3, 'pe1', { reps: '8-12', restSeconds: 90 })],
        },
        {
          id: 's2',
          name: 'Session 2',
          exercises: [programExercise('e2', 2, 'pe2', { reps: '10', restSeconds: 60 })],
        },
      ],
    };

    // session1: 450s, session2: 260s, margin: 5 min = 300s per session, 2 sessions
    expect(programEstimatedSeconds(program)).toBe(450 + 300 + 260 + 300);
  });

  it('applies no margin when marginMinutes is 0', () => {
    const program: Program = {
      goalId: 'hypertrophy',
      marginMinutes: 0,
      sessions: [
        { id: 's1', name: 'Session 1', exercises: [programExercise('e1', 1, 'pe1', { reps: '10', restSeconds: 0 })] },
      ],
    };

    // 1 * (10*4 + 0) + 60 = 100
    expect(programEstimatedSeconds(program)).toBe(100);
  });
});

describe('formatDuration', () => {
  it('formats under-60-minute durations with minutesOnly, in English', () => {
    expect(formatDuration(45 * 60, 'en')).toBe('45 min');
  });

  it('formats under-60-minute durations with minutesOnly, in French', () => {
    expect(formatDuration(45 * 60, 'fr')).toBe('45 min');
  });

  it('formats 60-minute-and-over durations with hoursMinutes, in English', () => {
    expect(formatDuration(90 * 60, 'en')).toBe('1 h 30 min');
  });

  it('formats 60-minute-and-over durations with hoursMinutes, in French', () => {
    expect(formatDuration(90 * 60, 'fr')).toBe('1 h 30 min');
  });

  it('rounds to the nearest minute', () => {
    expect(formatDuration(59.6 * 60, 'en')).toBe('1 h 0 min');
  });

  it('formats exactly 60 minutes with hoursMinutes', () => {
    expect(formatDuration(60 * 60, 'en')).toBe('1 h 0 min');
  });
});
