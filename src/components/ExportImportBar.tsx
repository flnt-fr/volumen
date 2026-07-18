import { useId, useRef, useState } from 'preact/hooks';
import type { TargetedEvent } from 'preact';
import { buildProgramFile, parseProgramFile } from '../lib/programFile';
import type { TrainingGoal } from '../lib/data';
import type { Program } from '../lib/types';
import { useTranslation } from '../i18n/context';

interface ExportImportBarProps {
  program: Program;
  goal: TrainingGoal;
  onImport: (program: Program) => void;
}

export default function ExportImportBar({ program, goal, onImport }: ExportImportBarProps) {
  const { t, locale } = useTranslation();
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importId = useId();

  async function handleExport() {
    const file = await buildProgramFile(program, goal, locale);
    const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `program-${goal.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(event: TargetedEvent<HTMLInputElement>) {
    const inputFile = event.currentTarget.files?.[0];
    if (!inputFile) return;

    try {
      const json = JSON.parse(await inputFile.text());
      const result = await parseProgramFile(json, locale);
      if (result.ok) {
        onImport(result.program);
        setErrors([]);
      } else {
        setErrors(result.errors);
      }
    } catch {
      setErrors([t('exportImport.invalidJson')]);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <article className="card border border-base-300 bg-base-100" data-testid="export-import-card">
      <div className="card-body">
        <h2 className="card-title text-xl font-black tracking-tight">{t('exportImport.heading')}</h2>
        <div className="flex flex-wrap items-end gap-4">
          <fieldset className="fieldset">
            <span className="fieldset-label invisible" aria-hidden="true">
              {t('exportImport.export')}
            </span>
            <button type="button" className="btn btn-primary" data-testid="export-button" onClick={handleExport}>
              {t('exportImport.export')}
            </button>
          </fieldset>

          <fieldset className="fieldset">
            <label className="fieldset-label" htmlFor={importId}>
              {t('exportImport.importLabel')}
            </label>
            <input
              id={importId}
              data-testid="import-input"
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="file-input file-input-bordered"
              onChange={handleImport}
            />
          </fieldset>
        </div>

        {errors.length > 0 && (
          <div role="alert" data-testid="import-error" className="alert alert-error alert-outline flex-col items-start">
            <p>{t('exportImport.invalidFile')}</p>
            <ul className="list-disc pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
