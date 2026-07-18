import { useEffect, useRef } from 'preact/hooks';
import type { Chart as ChartType, ChartConfiguration } from 'chart.js/auto';
import { formatSets, muscleGroupVolumeStatus } from '../lib/calculations';
import type { TrainingGoal } from '../lib/data';
import type { Program } from '../lib/types';
import { useTranslation } from '../i18n/context';
import { getMuscleLabel } from '../i18n/labels';
import type { Locale } from '../i18n/types';

interface MuscleGroupVolumeTableProps {
  program: Program;
  goal: TrainingGoal;
}

function readColor(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

interface MuscleRadarChartProps {
  rows: ReturnType<typeof muscleGroupVolumeStatus>;
  locale: Locale;
  actualLabel: string;
  minLabel: string;
  ariaLabel: string;
}

function MuscleRadarChart({ rows, locale, actualLabel, minLabel, ariaLabel }: MuscleRadarChartProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartType | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // chart.js is a heavy dependency only needed for this radar chart
    // (itself only rendered for the "hypertrophy" goal); loading it
    // dynamically here keeps it out of the initial bundle of the page's
    // single client:load island, which is what previously triggered the
    // build's >500kB chunk-size warning.
    let cancelled = false;

    const primaryColor = readColor('--color-primary') || '#1d6b4a';
    const errorColor = readColor('--color-error') || '#b3261e';
    const successColor = readColor('--color-success') || '#1d6b4a';
    const baseContentColor = readColor('--color-base-content') || '#16241d';

    const labels = rows.map((row) => getMuscleLabel(row.muscle, locale));
    const pointColors = rows.map((row) => (row.status === 'fail' ? errorColor : successColor));

    const config: ChartConfiguration<'radar'> = {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: actualLabel,
            data: rows.map((row) => row.weightedSets),
            backgroundColor: `color-mix(in srgb, ${primaryColor} 25%, transparent)`,
            borderColor: primaryColor,
            pointBackgroundColor: pointColors,
            pointBorderColor: pointColors,
            pointRadius: 4,
          },
          {
            label: minLabel,
            data: rows.map((row) => row.min),
            backgroundColor: 'transparent',
            borderColor: `color-mix(in srgb, ${baseContentColor} 40%, transparent)`,
            borderDash: [4, 4],
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            ticks: { color: baseContentColor, backdropColor: 'transparent' },
            grid: { color: `color-mix(in srgb, ${baseContentColor} 15%, transparent)` },
            angleLines: { color: `color-mix(in srgb, ${baseContentColor} 15%, transparent)` },
            pointLabels: { color: baseContentColor },
          },
        },
        plugins: {
          legend: { labels: { color: baseContentColor } },
        },
      },
    };

    let resizeObserver: ResizeObserver | undefined;
    let rafId: number | null = null;

    import('chart.js/auto').then(({ Chart }) => {
      // The effect's cleanup can run before this dynamic import resolves
      // (e.g. rows/locale changing again, or the component unmounting,
      // while the chart.js chunk is still loading) — bail out instead of
      // building a chart nobody will ever clean up.
      if (cancelled) return;

      chartRef.current = new Chart(canvas, config);

      // Chart.js's own `responsive: true` resize handling can get stuck at a
      // stale size after the wrapper shrinks below its `max-width` and then
      // grows back (e.g. narrowing then widening the viewport, or a tablet
      // rotation): the canvas never regrows to fill the container again
      // without an explicit resize nudge. Observe the wrapper directly and
      // force a resize on every size change to keep the chart in sync.
      //
      // The resize must be deferred to the next animation frame rather than
      // called synchronously inside the observer callback: `chart.resize()`
      // changes the canvas's own height, and since the wrapper's height is
      // itself derived from its content (the canvas), that change re-triggers
      // the same observer within the same notification cycle. That synchronous
      // feedback loop hits the browser's built-in ResizeObserver loop limit
      // ("ResizeObserver loop completed with undelivered notifications") and
      // gets cut off mid-resize, leaving the canvas stuck at an intermediate
      // size. Deferring with requestAnimationFrame lets each notification
      // cycle finish before we mutate the canvas, avoiding the loop entirely.
      const wrapper = wrapperRef.current;
      if (wrapper && typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver((entries) => {
          const entry = entries[0];
          if (!entry) return;
          const { width } = entry.contentRect;
          if (rafId !== null) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            rafId = null;
            if (width > 0) {
              // Pass the observed width explicitly (with a 1:1 aspect ratio,
              // matching the chart's default) rather than calling `resize()`
              // with no arguments: Chart.js's own auto-detection re-reads the
              // parent's bounding rect, which can still be stale right after
              // the wrapper grows back from a narrower breakpoint.
              chartRef.current?.resize(width, width);
            }
          });
        });
        resizeObserver.observe(wrapper);
      }
    });

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, locale, actualLabel, minLabel]);

  return (
    <div className="mx-auto max-w-xl" ref={wrapperRef}>
      <canvas ref={canvasRef} data-testid="muscle-group-volume-chart" role="img" aria-label={ariaLabel} />
    </div>
  );
}

export default function MuscleGroupVolumeTable({ program, goal }: MuscleGroupVolumeTableProps) {
  const { t, locale } = useTranslation();
  const rows = muscleGroupVolumeStatus(program, goal);

  return (
    <article className="card border border-base-300 bg-base-100" data-testid="muscle-group-volume-card">
      <div className="card-body">
        <h2 className="card-title text-xl font-black tracking-tight">{t('muscleGroupVolume.heading')}</h2>
        {rows.length === 0 ? (
          <p data-testid="muscle-group-volume-empty-message">{t('compliance.noRuleDefined')}</p>
        ) : (
          <>
            {goal.id === 'hypertrophy' && (
              <div data-testid="muscle-group-volume-chart-wrapper">
                <h3 className="mt-4 mb-2 text-sm font-semibold text-base-content/70">
                  {t('muscleGroupVolume.chart.heading')}
                </h3>
                <MuscleRadarChart
                  rows={rows}
                  locale={locale}
                  actualLabel={t('muscleGroupVolume.chart.legend.actual')}
                  minLabel={t('muscleGroupVolume.chart.legend.min')}
                  ariaLabel={t('muscleGroupVolume.caption')}
                />
              </div>
            )}
            <details className="collapse-arrow collapse bg-base-200">
              <summary className="collapse-title" data-testid="muscle-group-volume-table-summary">
                {t('muscleGroupVolume.table.summary')}
              </summary>
              <div className="collapse-content">
                <table
                  className="table"
                  data-testid="muscle-group-volume-table"
                  tabIndex={0}
                  aria-label={t('muscleGroupVolume.caption')}
                >
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
                      <tr key={row.muscle} data-testid="muscle-group-volume-row">
                        <th scope="row">{getMuscleLabel(row.muscle, locale)}</th>
                        <td>{row.primarySets}</td>
                        <td>{row.secondarySets}</td>
                        <td>{formatSets(row.weightedSets, locale)}</td>
                        <td>{row.min}</td>
                        <td className={row.status === 'pass' ? 'text-success' : 'text-error'}>
                          {row.status === 'pass' ? '✓' : '✗'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p data-testid="muscle-group-volume-note">{t('muscleGroupVolume.note')}</p>
              </div>
            </details>
          </>
        )}
      </div>
    </article>
  );
}
