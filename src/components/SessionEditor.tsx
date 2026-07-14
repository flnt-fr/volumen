import { useId } from 'preact/hooks';
import ExercisePicker from './ExercisePicker';
import ExerciseRow from './ExerciseRow';
import MuscleVolumeTable from './MuscleVolumeTable';
import {
  exerciseMuscleContributions,
  formatDuration,
  formatSets,
  sessionEstimatedSeconds,
} from '../lib/calculations';
import type { ProgramExercise, Session } from '../lib/types';
import { useTranslation } from '../i18n/context';

interface SessionEditorProps {
  session: Session;
  marginMinutes: number;
  onChange: (session: Session) => void;
  onRemove: () => void;
}

function createExercise(exerciseId: string): ProgramExercise {
  return {
    id: crypto.randomUUID(),
    exerciseId,
    sets: 3,
    reps: '8-12',
    restSeconds: 90,
  };
}

export default function SessionEditor({ session, marginMinutes, onChange, onRemove }: SessionEditorProps) {
  const nameId = useId();
  const { t, locale } = useTranslation();
  const contributions = exerciseMuscleContributions(session, locale);
  const estimatedSeconds = sessionEstimatedSeconds(session) + marginMinutes * 60;

  function addExercise(exerciseId: string) {
    onChange({ ...session, exercises: [...session.exercises, createExercise(exerciseId)] });
  }

  function updateExercise(updated: ProgramExercise) {
    onChange({
      ...session,
      exercises: session.exercises.map((exercise) => (exercise.id === updated.id ? updated : exercise)),
    });
  }

  function removeExercise(exerciseId: string) {
    onChange({ ...session, exercises: session.exercises.filter((exercise) => exercise.id !== exerciseId) });
  }

  return (
    <article className="card border border-base-300 bg-base-100" data-testid="session">
      <div className="card-body gap-4">
        <header className="flex flex-wrap items-end gap-3">
          <fieldset className="fieldset grow">
            <label className="fieldset-label" htmlFor={nameId}>
              {t('session.nameLabel')}
            </label>
            <input
              id={nameId}
              data-testid="session-name-input"
              type="text"
              className="input input-bordered w-full"
              value={session.name}
              onInput={(event) => onChange({ ...session, name: event.currentTarget.value })}
            />
          </fieldset>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            data-testid="delete-session-button"
            aria-label={t('session.deleteAria', { name: session.name })}
            onClick={onRemove}
          >
            {t('session.delete')}
          </button>
        </header>

        {session.exercises.length > 0 && (
          <table
            className="table"
            data-testid="exercise-table"
            tabIndex={0}
            aria-label={t('session.tableCaption', { name: session.name })}
          >
            <caption className="sr-only">{t('session.tableCaption', { name: session.name })}</caption>
            <thead>
              <tr>
                <th scope="col">{t('session.tableExercise')}</th>
                <th scope="col">{t('session.tableSets')}</th>
                <th scope="col">{t('session.tableReps')}</th>
                <th scope="col">{t('session.tableRest')}</th>
                <th scope="col">{t('session.tableTime')}</th>
                <th scope="col">
                  <span className="sr-only">{t('session.tableActions')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {session.exercises.map((exercise) => (
                <ExerciseRow
                  key={exercise.id}
                  exercise={exercise}
                  onChange={updateExercise}
                  onRemove={() => removeExercise(exercise.id)}
                />
              ))}
            </tbody>
          </table>
        )}

        <p data-testid="session-total-time">
          {t('session.estimatedTime', {
            duration: formatDuration(estimatedSeconds, locale),
            margin: formatDuration(marginMinutes * 60, locale),
          })}
        </p>

        {contributions.length > 0 && (
          <details className="collapse-arrow collapse bg-base-200">
            <summary className="collapse-title" data-testid="muscle-contribution-summary">
              {t('session.muscleContribution.heading')}
            </summary>
            <div className="collapse-content">
              <table
                className="table"
                data-testid="muscle-contribution-table"
                tabIndex={0}
                aria-label={t('session.muscleContribution.heading')}
              >
                <thead>
                  <tr>
                    <th scope="col">{t('session.muscleContribution.exercise')}</th>
                    <th scope="col">{t('session.muscleContribution.primaryMuscles')}</th>
                    <th scope="col">{t('session.muscleContribution.direct')}</th>
                    <th scope="col">{t('session.muscleContribution.secondaryMuscles')}</th>
                    <th scope="col">{t('session.muscleContribution.secondary')}</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((contribution) => (
                    <tr key={contribution.id} data-testid="muscle-contribution-row">
                      <th scope="row">{contribution.label}</th>
                      <td>{contribution.primaryMuscles}</td>
                      <td>{contribution.sets}</td>
                      <td>{contribution.secondaryMuscles}</td>
                      <td>{formatSets(contribution.secondaryWeightedSets, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}

        <ExercisePicker onAdd={addExercise} />

        <details className="collapse-arrow collapse bg-base-200">
          <summary className="collapse-title" data-testid="muscle-volume-summary">
            {t('session.muscleSummary')}
          </summary>
          <div className="collapse-content">
            <MuscleVolumeTable session={session} />
          </div>
        </details>
      </div>
    </article>
  );
}
