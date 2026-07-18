import SessionEditor from './SessionEditor';
import { formatDuration, programEstimatedSeconds } from '../lib/calculations';
import { clampRoundedInput } from '../lib/numberInput';
import type { Program, Session } from '../lib/types';
import { useTranslation } from '../i18n/context';

interface SessionListProps {
  sessions: Session[];
  marginMinutes: number;
  onChange: (sessions: Session[]) => void;
  onMarginMinutesChange: (marginMinutes: number) => void;
}

function createSession(defaultName: string): Session {
  return {
    id: crypto.randomUUID(),
    name: defaultName,
    exercises: [],
  };
}

export default function SessionList({ sessions, marginMinutes, onChange, onMarginMinutesChange }: SessionListProps) {
  const { t, locale } = useTranslation();
  const program: Program = { goalId: '', sessions, marginMinutes };

  function addSession() {
    const index = sessions.length + 1;
    onChange([...sessions, createSession(t('sessions.defaultName', { index }))]);
  }

  function updateSession(updated: Session) {
    onChange(sessions.map((session) => (session.id === updated.id ? updated : session)));
  }

  function removeSession(sessionId: string) {
    onChange(sessions.filter((session) => session.id !== sessionId));
  }

  return (
    <section className="flex flex-col gap-4" data-testid="sessions-section">
      <h2 className="text-xl font-black tracking-tight">{t('sessions.heading')}</h2>
      <fieldset className="fieldset w-full max-w-xs">
        <label className="fieldset-label" htmlFor="margin-minutes-input">
          {t('sessions.marginLabel')}
        </label>
        <input
          id="margin-minutes-input"
          data-testid="margin-input"
          type="number"
          min={0}
          className="input input-bordered"
          value={marginMinutes}
          onInput={(event) => onMarginMinutesChange(clampRoundedInput(event.currentTarget.value, 0))}
        />
      </fieldset>
      {sessions.length === 0 && <p data-testid="no-sessions-message">{t('sessions.empty')}</p>}
      {sessions.map((session) => (
        <SessionEditor
          key={session.id}
          session={session}
          marginMinutes={marginMinutes}
          onChange={updateSession}
          onRemove={() => removeSession(session.id)}
        />
      ))}
      <button type="button" className="btn btn-primary self-start" data-testid="add-session-button" onClick={addSession}>
        {t('sessions.add')}
      </button>
      <p data-testid="program-total-time">
        {t('sessions.totalTime', { duration: formatDuration(programEstimatedSeconds(program), locale) })}
      </p>
    </section>
  );
}
