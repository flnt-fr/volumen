import { useEffect, useState } from 'preact/hooks';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import ExportImportBar from './ExportImportBar';
import GoalSelector from './GoalSelector';
import MuscleGroupVolumeTable from './MuscleGroupVolumeTable';
import RuleComplianceCard from './RuleComplianceCard';
import SessionList from './SessionList';
import { getGoalById, trainingGoals } from '../lib/data';
import { loadStoredProgram, saveProgram } from '../lib/programStore';
import type { Program } from '../lib/types';
import { LocaleProvider, useTranslation } from '../i18n/context';
import { hasTourBeenSeen } from '../lib/tourStore';
import { startTour } from '../lib/tour';

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
    <div data-testid="app-intro">
      <p className="mb-1 font-mono text-xs font-semibold tracking-widest text-primary uppercase">
        {t('app.eyebrow')}
      </p>
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{t('app.heading')}</h1>
    </div>
  );
}

/**
 * Auto-starts the guided tour on a visitor's first arrival on /app. Renders
 * null and only exists so its effect runs inside the LocaleProvider tree
 * (useTranslation() requires it), same reasoning as AppIntro above. The
 * empty dependency array means it only ever fires once per mount, i.e. once
 * per /app page load — by the time this effect runs, every sibling
 * component in the tree has already committed to the DOM in the same pass,
 * so every data-testid the tour targets already exists (see src/lib/tour.ts
 * for why steps are still individually guarded against missing elements).
 */
function AppTourAutoStart() {
  const { t } = useTranslation();

  useEffect(() => {
    if (hasTourBeenSeen()) return;
    startTour(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function emptyProgram(): Program {
  return { goalId: trainingGoals[0].id, sessions: [], marginMinutes: 0 };
}

export default function ProgramBuilder() {
  const [program, setProgram] = useState<Program>(() => emptyProgram());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadStoredProgram().then((stored) => {
      if (cancelled) return;
      setProgram(stored ?? emptyProgram());
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveProgram(program);
  }, [program, loaded]);

  const goal = getGoalById(program.goalId) ?? trainingGoals[0];

  return (
    <LocaleProvider>
      <div className="min-h-screen bg-base-200">
        <AppHeader />
        <AppTourAutoStart />
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
