import { checkGoalCompliance, goalHasVolumeRule } from '../lib/calculations';
import type { TrainingGoal } from '../lib/data';
import type { Program } from '../lib/types';
import { useTranslation } from '../i18n/context';

interface RuleComplianceCardProps {
  program: Program;
  goal: TrainingGoal;
}

export default function RuleComplianceCard({ program, goal }: RuleComplianceCardProps) {
  const { t, locale } = useTranslation();
  const rules = checkGoalCompliance(program, goal, locale);
  const passCount = rules.filter((rule) => rule.status === 'pass').length;

  return (
    <article data-testid="compliance-card">
      <h2>{t('compliance.heading')}</h2>
      {rules.length === 0 ? (
        <p data-testid="compliance-empty-message">
          {goalHasVolumeRule(goal) ? t('compliance.addToEvaluate') : t('compliance.noRuleDefined')}
        </p>
      ) : (
        <>
          <p aria-live="polite" data-testid="compliance-summary">
            {t('compliance.summary', { pass: passCount, total: rules.length })}
          </p>
          <ul data-testid="compliance-rule-list">
            {rules.map((rule) => (
              <li
                key={rule.id}
                data-testid="compliance-rule"
                className={rule.status === 'pass' ? 'rule-pass' : 'rule-fail'}
              >
                {rule.status === 'pass' ? '✓ ' : '✗ '}
                {rule.message}
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
