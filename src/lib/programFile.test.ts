import { describe, expect, it } from 'vitest';
import { exercises, getGoalById } from './data';
import { buildProgramFile, getSchemas, parseProgramFile, parseStoredProgram } from './programFile';
import type { Program } from './types';

const exerciseA = exercises[0];
const exerciseB = exercises[1];

function samplePrograms(): Program {
  return {
    goalId: 'hypertrophy',
    marginMinutes: 0,
    sessions: [
      {
        id: 's1',
        name: 'Session 1',
        exercises: [
          { id: 'pe1', exerciseId: exerciseA.id, sets: 3, reps: '8-12', restSeconds: 90 },
          { id: 'pe2', exerciseId: exerciseB.id, sets: 4, reps: '10', restSeconds: 60 },
        ],
      },
    ],
  };
}

describe('ProgramFileSchema round-trip', () => {
  it('export then import yields an equivalent program', async () => {
    const program = samplePrograms();
    const goal = getGoalById(program.goalId)!;

    const file = await buildProgramFile(program, goal);
    const { ProgramFileSchema } = await getSchemas();
    expect(ProgramFileSchema.safeParse(file).success).toBe(true);

    const result = await parseProgramFile(file);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.program).toEqual(program);
    }
  });

  it('preserves a non-zero marginMinutes across export and re-import', async () => {
    const program = { ...samplePrograms(), marginMinutes: 15 };
    const goal = getGoalById(program.goalId)!;

    const file = await buildProgramFile(program, goal);
    expect(file.marginMinutes).toBe(15);

    const result = await parseProgramFile(file);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.program.marginMinutes).toBe(15);
    }
  });

  it('defaults marginMinutes to 0 when importing a file exported before the field existed', async () => {
    const program = samplePrograms();
    const goal = getGoalById(program.goalId)!;
    const file = (await buildProgramFile(program, goal)) as Record<string, unknown>;
    delete file.marginMinutes;

    const result = await parseProgramFile(file);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.program.marginMinutes).toBe(0);
    }
  });
});

describe('parseProgramFile invalid input', () => {
  it('rejects malformed JSON structure', async () => {
    const result = await parseProgramFile({ not: 'a program file' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it('rejects an unknown exerciseId', async () => {
    const program = samplePrograms();
    const goal = getGoalById(program.goalId)!;
    const file = await buildProgramFile(program, goal);
    file.sessions[0].exercises[0].exerciseId = 'not-a-real-exercise-id';

    const result = await parseProgramFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes('exerciseId'))).toBe(true);
    }
  });

  it('rejects an unknown goalId', async () => {
    const program = samplePrograms();
    const goal = getGoalById(program.goalId)!;
    const file = await buildProgramFile(program, goal);
    file.header.goal.id = 'not-a-real-goal';

    const result = await parseProgramFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes('goal.id'))).toBe(true);
    }
  });

  it('reports errors in French when a French locale is requested', async () => {
    const result = await parseProgramFile({ not: 'a program file' }, 'fr');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes('champ manquant'))).toBe(true);
    }
  });
});

describe('parseStoredProgram', () => {
  it('defaults marginMinutes to 0 for a program saved before marginMinutes existed', async () => {
    const legacyStored = {
      goalId: 'hypertrophy',
      sessions: [
        {
          id: 's1',
          name: 'Session 1',
          exercises: [{ id: 'pe1', exerciseId: exerciseA.id, sets: 3, reps: '8-12', restSeconds: 90 }],
        },
      ],
    };

    const program = await parseStoredProgram(legacyStored);
    expect(program).not.toBeNull();
    expect(program?.marginMinutes).toBe(0);
  });

  it('round-trips a program that already has a marginMinutes value', async () => {
    const stored = {
      goalId: 'hypertrophy',
      marginMinutes: 5,
      sessions: [
        {
          id: 's1',
          name: 'Session 1',
          exercises: [{ id: 'pe1', exerciseId: exerciseA.id, sets: 3, reps: '8-12', restSeconds: 90 }],
        },
      ],
    };

    const program = await parseStoredProgram(stored);
    expect(program).not.toBeNull();
    expect(program?.marginMinutes).toBe(5);
  });
});

describe('buildProgramFile locale', () => {
  it('snapshots the goal name and definition in the requested locale', async () => {
    const program = samplePrograms();
    const goal = getGoalById(program.goalId)!;

    const file = await buildProgramFile(program, goal, 'fr');
    expect(file.header.goal.name).toBe('Hypertrophie (croissance musculaire)');
  });
});
