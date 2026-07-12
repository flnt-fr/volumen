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
    <article>
      <h2>{t('goalSelector.heading')}</h2>
      <label htmlFor="goal-select">{t('goalSelector.label')}</label>
      <select
        id="goal-select"
        data-testid="goal-select"
        value={goalId}
        onChange={(event) => onChange(event.target.value)}
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
          <ul>
            {getGoalKeyPrinciples(goal, locale).map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
