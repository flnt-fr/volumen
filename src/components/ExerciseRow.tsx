import { getExerciseById } from '../lib/data';
import { EQUIPMENT_CHANGE_SECONDS, exerciseEstimatedSeconds, formatDuration } from '../lib/calculations';
import { clampRoundedInput } from '../lib/numberInput';
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
          className="input input-bordered input-sm"
          value={exercise.sets}
          onInput={(event) => onChange({ ...exercise, sets: clampRoundedInput(event.currentTarget.value, 1) })}
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
          className="input input-bordered input-sm"
          value={exercise.reps}
          onInput={(event) => onChange({ ...exercise, reps: event.currentTarget.value })}
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
          className="input input-bordered input-sm"
          value={exercise.restSeconds}
          onInput={(event) => onChange({ ...exercise, restSeconds: clampRoundedInput(event.currentTarget.value, 0) })}
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
          className="btn btn-ghost btn-sm"
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
