import { useEffect, useState } from 'preact/hooks';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import ExportImportBar from './ExportImportBar';
import GoalSelector from './GoalSelector';
import MuscleGroupVolumeTable from './MuscleGroupVolumeTable';
import RuleComplianceCard from './RuleComplianceCard';
import SessionList from './SessionList';
import { getGoalById, trainingGoals } from '../lib/data';
import { parseStoredProgram } from '../lib/programFile';
import type { Program } from '../lib/types';
import { LocaleProvider, useTranslation } from '../i18n/context';

const STORAGE_KEY = 'volumen:program';

/**
 * Small page-level banner that echoes the homepage's typographic identity
 * (tracked-out uppercase eyebrow + bold black heading) so /app reads as the
 * same product as the marketing pages, without repeating the treatment on
 * every card below. Kept as its own component (rather than inline JSX in
 * ProgramBuilder) so useTranslation() runs inside the LocaleProvider tree.
 */
function AppIntro() {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-1 font-mono text-xs font-semibold tracking-widest text-primary uppercase">
        {t('app.eyebrow')}
      </p>
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{t('app.heading')}</h1>
    </div>
  );
}

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
      <div className="min-h-screen bg-base-200">
        <AppHeader />
        <main className="container mx-auto flex flex-col gap-6 px-4 py-6 sm:px-6">
          <AppIntro />

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

        <AppFooter />
      </div>
    </LocaleProvider>
  );
}
