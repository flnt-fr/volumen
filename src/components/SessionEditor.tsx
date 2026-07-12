import { useId } from 'react';
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
    <article data-testid="session">
      <header>
        <label htmlFor={nameId}>{t('session.nameLabel')}</label>
        <input
          id={nameId}
          data-testid="session-name-input"
          type="text"
          value={session.name}
          onChange={(event) => onChange({ ...session, name: event.target.value })}
        />
        <button
          type="button"
          className="outline"
          data-testid="delete-session-button"
          aria-label={t('session.deleteAria', { name: session.name })}
          onClick={onRemove}
        >
          {t('session.delete')}
        </button>
      </header>

      {session.exercises.length > 0 && (
        <table data-testid="exercise-table">
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
        <>
          <h3>{t('session.muscleContribution.heading')}</h3>
          <table data-testid="muscle-contribution-table">
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
        </>
      )}

      <ExercisePicker onAdd={addExercise} />

      <details>
        <summary data-testid="muscle-volume-summary">{t('session.muscleSummary')}</summary>
        <MuscleVolumeTable session={session} />
      </details>
    </article>
  );
}
