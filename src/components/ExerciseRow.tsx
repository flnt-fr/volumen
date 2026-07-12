import { getExerciseById } from '../lib/data';
import { EQUIPMENT_CHANGE_SECONDS, exerciseEstimatedSeconds, formatDuration } from '../lib/calculations';
import type { ProgramExercise } from '../lib/types';
import { useTranslation } from '../i18n/context';
import { getExerciseName } from '../i18n/exerciseNames';

interface ExerciseRowProps {
  exercise: ProgramExercise;
  onChange: (exercise: ProgramExercise) => void;
  onRemove: () => void;
}

export default function ExerciseRow({ exercise, onChange, onRemove }: ExerciseRowProps) {
  const { t, locale } = useTranslation();
  const definition = getExerciseById(exercise.exerciseId);
  const exerciseName = definition ? getExerciseName(definition, locale) : exercise.exerciseId;

  return (
    <tr data-testid="exercise-row">
      <th scope="row">{exerciseName}</th>
      <td>
        <label className="sr-only" htmlFor={`sets-${exercise.id}`}>
          {t('exerciseRow.setsLabel')}
        </label>
        <input
          id={`sets-${exercise.id}`}
          data-testid="exercise-sets-input"
          type="number"
          min={1}
          value={exercise.sets}
          onChange={(event) => {
            const rounded = Math.round(Number(event.target.value));
            onChange({ ...exercise, sets: Math.max(1, Number.isNaN(rounded) ? 1 : rounded) });
          }}
        />
      </td>
      <td>
        <label className="sr-only" htmlFor={`reps-${exercise.id}`}>
          {t('exerciseRow.repsLabel')}
        </label>
        <input
          id={`reps-${exercise.id}`}
          data-testid="exercise-reps-input"
          type="text"
          value={exercise.reps}
          onChange={(event) => onChange({ ...exercise, reps: event.target.value })}
        />
      </td>
      <td>
        <label className="sr-only" htmlFor={`rest-${exercise.id}`}>
          {t('exerciseRow.restLabel')}
        </label>
        <input
          id={`rest-${exercise.id}`}
          data-testid="exercise-rest-input"
          type="number"
          min={0}
          value={exercise.restSeconds}
          onChange={(event) => {
            const rounded = Math.round(Number(event.target.value));
            onChange({ ...exercise, restSeconds: Math.max(0, Number.isNaN(rounded) ? 0 : rounded) });
          }}
        />
      </td>
      <td data-testid="exercise-time-cell">
        {t('exerciseRow.timeBreakdown', {
          duration: formatDuration(exerciseEstimatedSeconds(exercise), locale),
          changeTime: formatDuration(EQUIPMENT_CHANGE_SECONDS, locale),
        })}
      </td>
      <td>
        <button
          type="button"
          className="outline"
          data-testid="delete-exercise-button"
          aria-label={t('exerciseRow.deleteAria', { name: exerciseName })}
          onClick={onRemove}
        >
          {t('exerciseRow.delete')}
        </button>
      </td>
    </tr>
  );
}
