import { trainingGoals, getGoalById } from '../lib/data';
import { useTranslation } from '../i18n/context';
import { getGoalDefinition, getGoalKeyPrinciples, getGoalName } from '../i18n/labels';

interface GoalSelectorProps {
  goalId: string;
  onChange: (goalId: string) => void;
}

export default function GoalSelector({ goalId, onChange }: GoalSelectorProps) {
  const { t, locale } = useTranslation();
  const goal = getGoalById(goalId);

  return (
    <article className="card border border-base-300 bg-base-100">
      <div className="card-body">
        <h2 className="card-title text-xl font-black tracking-tight">{t('goalSelector.heading')}</h2>
        <label className="fieldset-label" htmlFor="goal-select">
          {t('goalSelector.label')}
        </label>
        <select
          id="goal-select"
          data-testid="goal-select"
          className="select select-bordered w-full max-w-xs"
          value={goalId}
          onChange={(event) => onChange(event.currentTarget.value)}
        >
          {trainingGoals.map((trainingGoal) => (
            <option key={trainingGoal.id} value={trainingGoal.id}>
              {getGoalName(trainingGoal, locale)}
            </option>
          ))}
        </select>

        {goal && (
          <div>
            <p>{getGoalDefinition(goal, locale)}</p>
            <ul className="list-disc pl-5">
              {getGoalKeyPrinciples(goal, locale).map((principle) => (
                <li key={principle}>{principle}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
