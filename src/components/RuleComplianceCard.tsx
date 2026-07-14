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
    <article className="card border border-base-300 bg-base-100" data-testid="compliance-card">
      <div className="card-body">
        <h2 className="card-title text-xl font-black tracking-tight">{t('compliance.heading')}</h2>
        {rules.length === 0 ? (
          <p data-testid="compliance-empty-message">
            {goalHasVolumeRule(goal) ? t('compliance.addToEvaluate') : t('compliance.noRuleDefined')}
          </p>
        ) : (
          <>
            <p aria-live="polite" data-testid="compliance-summary">
              {t('compliance.summary', { pass: passCount, total: rules.length })}
            </p>
            <ul className="flex flex-col gap-1" data-testid="compliance-rule-list">
              {rules.map((rule) => (
                <li
                  key={rule.id}
                  data-testid="compliance-rule"
                  className={rule.status === 'pass' ? 'text-success' : 'text-error'}
                >
                  {rule.status === 'pass' ? '✓ ' : '✗ '}
                  {rule.message}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  );
}
