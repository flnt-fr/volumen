import { formatSets, muscleGroupVolumeStatus } from '../lib/calculations';
import type { TrainingGoal } from '../lib/data';
import type { Program } from '../lib/types';
import { useTranslation } from '../i18n/context';
import { getMuscleLabel } from '../i18n/labels';

interface MuscleGroupVolumeTableProps {
  program: Program;
  goal: TrainingGoal;
}

export default function MuscleGroupVolumeTable({ program, goal }: MuscleGroupVolumeTableProps) {
  const { t, locale } = useTranslation();
  const rows = muscleGroupVolumeStatus(program, goal);

  return (
    <article data-testid="muscle-group-volume-card">
      <h2>{t('muscleGroupVolume.heading')}</h2>
      {rows.length === 0 ? (
        <p data-testid="muscle-group-volume-empty-message">{t('compliance.noRuleDefined')}</p>
      ) : (
        <>
          <table data-testid="muscle-group-volume-table">
            <caption className="sr-only">{t('muscleGroupVolume.caption')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('muscleVolume.muscle')}</th>
                <th scope="col">{t('muscleGroupVolume.direct')}</th>
                <th scope="col">{t('muscleGroupVolume.secondary')}</th>
                <th scope="col">{t('muscleGroupVolume.weighted')}</th>
                <th scope="col">{t('muscleGroupVolume.minimum')}</th>
                <th scope="col">
                  <span className="sr-only">{t('muscleGroupVolume.status')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.muscle}
                  data-testid="muscle-group-volume-row"
                  className={row.status === 'pass' ? 'rule-pass' : 'rule-fail'}
                >
                  <th scope="row">{getMuscleLabel(row.muscle, locale)}</th>
                  <td>{row.primarySets}</td>
                  <td>{row.secondarySets}</td>
                  <td>{formatSets(row.weightedSets, locale)}</td>
                  <td>{row.min}</td>
                  <td>{row.status === 'pass' ? '✓' : '✗'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p data-testid="muscle-group-volume-note">{t('muscleGroupVolume.note')}</p>
        </>
      )}
    </article>
  );
}
