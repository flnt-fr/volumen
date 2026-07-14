import { setsByMuscle } from '../lib/calculations';
import type { Session } from '../lib/types';
import { useTranslation } from '../i18n/context';
import { getMuscleLabel } from '../i18n/labels';

interface MuscleVolumeTableProps {
  session: Session;
}

export default function MuscleVolumeTable({ session }: MuscleVolumeTableProps) {
  const { t, locale } = useTranslation();
  const counts = setsByMuscle(session);
  // Sort by the raw (locale-independent) key so row order stays stable across locales.
  const muscles = Array.from(new Set([...Object.keys(counts.primary), ...Object.keys(counts.secondary)])).sort();

  if (muscles.length === 0) {
    return <p data-testid="no-exercises-message">{t('muscleVolume.empty')}</p>;
  }

  return (
    <table
      className="table"
      data-testid="muscle-volume-table"
      tabIndex={0}
      aria-label={t('muscleVolume.caption', { name: session.name })}
    >
      <caption className="sr-only">{t('muscleVolume.caption', { name: session.name })}</caption>
      <thead>
        <tr>
          <th scope="col">{t('muscleVolume.muscle')}</th>
          <th scope="col">{t('muscleVolume.primary')}</th>
          <th scope="col">{t('muscleVolume.secondary')}</th>
        </tr>
      </thead>
      <tbody>
        {muscles.map((muscle) => (
          <tr key={muscle}>
            <th scope="row">{getMuscleLabel(muscle, locale)}</th>
            <td>{counts.primary[muscle] ?? 0}</td>
            <td>{counts.secondary[muscle] ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
