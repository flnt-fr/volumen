import { useId, useRef, useState } from 'react';
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

  function handleExport() {
    const file = buildProgramFile(program, goal, locale);
    const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `program-${goal.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const inputFile = event.target.files?.[0];
    if (!inputFile) return;

    try {
      const json = JSON.parse(await inputFile.text());
      const result = parseProgramFile(json, locale);
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
    <article>
      <h2>{t('exportImport.heading')}</h2>
      <button type="button" data-testid="export-button" onClick={handleExport}>
        {t('exportImport.export')}
      </button>

      <label htmlFor={importId}>{t('exportImport.importLabel')}</label>
      <input
        id={importId}
        data-testid="import-input"
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleImport}
      />

      {errors.length > 0 && (
        <div role="alert" data-testid="import-error" className="import-errors">
          <p>{t('exportImport.invalidFile')}</p>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
