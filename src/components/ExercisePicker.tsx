import { useId, useMemo, useState, type SyntheticEvent } from 'react';
import { exercises } from '../lib/data';
import { useTranslation } from '../i18n/context';
import { getExerciseName } from '../i18n/exerciseNames';

interface ExercisePickerProps {
  onAdd: (exerciseId: string) => void;
}

export default function ExercisePicker({ onAdd }: ExercisePickerProps) {
  const { t, locale } = useTranslation();
  const [value, setValue] = useState('');
  const listId = useId();

  const exercisesByName = useMemo(
    () => new Map(exercises.map((exercise) => [getExerciseName(exercise, locale), exercise.id])),
    [locale],
  );
  const exerciseOptions = useMemo(
    () => exercises.map((exercise) => <option key={exercise.id} value={getExerciseName(exercise, locale)} />),
    [locale],
  );

  const trimmedValue = value.trim();
  const isKnownExercise = exercisesByName.has(trimmedValue);
  const hasNoMatch = trimmedValue.length > 0 && !isKnownExercise;

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const exerciseId = exercisesByName.get(trimmedValue);
    if (!exerciseId) return;
    onAdd(exerciseId);
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={listId}>{t('exercisePicker.label')}</label>
      <input
        id={listId}
        data-testid="exercise-picker-input"
        list={`${listId}-options`}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t('exercisePicker.placeholder')}
        autoComplete="off"
      />
      <datalist id={`${listId}-options`}>{exerciseOptions}</datalist>
      <button type="submit" data-testid="exercise-picker-add-button" disabled={!isKnownExercise}>
        {t('exercisePicker.add')}
      </button>
      {hasNoMatch && (
        <p role="status" data-testid="exercise-picker-no-match">
          {t('exercisePicker.noMatch', { value: trimmedValue })}
        </p>
      )}
    </form>
  );
}
