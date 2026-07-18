import { useId, useMemo, useState } from 'preact/hooks';
import type { TargetedEvent } from 'preact';
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

  // Keyed by lowercase name so a match doesn't depend on the visitor typing
  // the exact casing shown in the <datalist> (e.g. "bench press" should match
  // "Bench Press" just as well as picking it from the suggestions does).
  const exercisesByNormalizedName = useMemo(
    () => new Map(exercises.map((exercise) => [getExerciseName(exercise, locale).toLowerCase(), exercise.id])),
    [locale],
  );
  const exerciseOptions = useMemo(
    () => exercises.map((exercise) => <option key={exercise.id} value={getExerciseName(exercise, locale)} />),
    [locale],
  );

  const trimmedValue = value.trim();
  const normalizedValue = trimmedValue.toLowerCase();
  const isKnownExercise = exercisesByNormalizedName.has(normalizedValue);
  const isPartialMatch = useMemo(
    () =>
      normalizedValue.length > 0 &&
      exercises.some((exercise) => getExerciseName(exercise, locale).toLowerCase().startsWith(normalizedValue)),
    [normalizedValue, locale],
  );
  // Only surface the "no match" message once the current text can no longer
  // become a valid exercise by typing more (i.e. it isn't a prefix of any
  // known name) — otherwise it fires on every keystroke of a work-in-progress
  // partial name while the <datalist> is still showing live suggestions.
  const hasNoMatch = trimmedValue.length > 0 && !isKnownExercise && !isPartialMatch;

  function handleSubmit(event: TargetedEvent<HTMLFormElement>) {
    event.preventDefault();
    const exerciseId = exercisesByNormalizedName.get(normalizedValue);
    if (!exerciseId) return;
    onAdd(exerciseId);
    setValue('');
  }

  return (
    <form className="flex flex-wrap items-end gap-3" onSubmit={handleSubmit}>
      <fieldset className="fieldset grow">
        <label className="fieldset-label" htmlFor={listId}>
          {t('exercisePicker.label')}
        </label>
        <input
          id={listId}
          data-testid="exercise-picker-input"
          list={`${listId}-options`}
          type="text"
          className="input input-bordered w-full"
          value={value}
          onInput={(event) => setValue(event.currentTarget.value)}
          placeholder={t('exercisePicker.placeholder')}
          autoComplete="off"
        />
      </fieldset>
      <datalist id={`${listId}-options`}>{exerciseOptions}</datalist>
      <button type="submit" className="btn btn-primary" data-testid="exercise-picker-add-button" disabled={!isKnownExercise}>
        {t('exercisePicker.add')}
      </button>
      {hasNoMatch && (
        <p role="status" className="basis-full text-sm text-base-content/70" data-testid="exercise-picker-no-match">
          {t('exercisePicker.noMatch', { value: trimmedValue })}
        </p>
      )}
    </form>
  );
}
