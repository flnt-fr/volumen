import { useEffect, useState } from 'react';
import AppHeader from './AppHeader';
import ExportImportBar from './ExportImportBar';
import GoalSelector from './GoalSelector';
import MuscleGroupVolumeTable from './MuscleGroupVolumeTable';
import RuleComplianceCard from './RuleComplianceCard';
import SessionList from './SessionList';
import { getGoalById, trainingGoals } from '../lib/data';
import { parseStoredProgram } from '../lib/programFile';
import type { Program } from '../lib/types';
import { LocaleProvider } from '../i18n/context';

const STORAGE_KEY = 'volumen:program';

function emptyProgram(): Program {
  return { goalId: trainingGoals[0].id, sessions: [], marginMinutes: 0 };
}

function loadProgram(): Program {
  if (typeof window === 'undefined') return emptyProgram();
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return emptyProgram();
  try {
    return parseStoredProgram(JSON.parse(stored)) ?? emptyProgram();
  } catch {
    return emptyProgram();
  }
}

export default function ProgramBuilder() {
  const [program, setProgram] = useState<Program>(() => emptyProgram());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgram(loadProgram());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(program));
  }, [program, loaded]);

  const goal = getGoalById(program.goalId) ?? trainingGoals[0];

  return (
    <LocaleProvider>
      <AppHeader />
      <main className="container">
        <GoalSelector goalId={program.goalId} onChange={(goalId) => setProgram({ ...program, goalId })} />

        <SessionList
          sessions={program.sessions}
          marginMinutes={program.marginMinutes}
          onChange={(sessions) => setProgram({ ...program, sessions })}
          onMarginMinutesChange={(marginMinutes) => setProgram({ ...program, marginMinutes })}
        />

        <MuscleGroupVolumeTable program={program} goal={goal} />

        <RuleComplianceCard program={program} goal={goal} />

        <ExportImportBar program={program} goal={goal} onImport={setProgram} />
      </main>
    </LocaleProvider>
  );
}
