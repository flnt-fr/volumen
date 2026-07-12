import SessionEditor from './SessionEditor';
import { formatDuration, programEstimatedSeconds } from '../lib/calculations';
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
    <section data-testid="sessions-section">
      <h2>{t('sessions.heading')}</h2>
      <label htmlFor="margin-minutes-input">{t('sessions.marginLabel')}</label>
      <input
        id="margin-minutes-input"
        data-testid="margin-input"
        type="number"
        min={0}
        value={marginMinutes}
        onChange={(event) => {
          const rounded = Math.round(Number(event.target.value));
          onMarginMinutesChange(Math.max(0, Number.isNaN(rounded) ? 0 : rounded));
        }}
      />
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
      <button type="button" data-testid="add-session-button" onClick={addSession}>
        {t('sessions.add')}
      </button>
      <p data-testid="program-total-time">
        {t('sessions.totalTime', { duration: formatDuration(programEstimatedSeconds(program), locale) })}
      </p>
    </section>
  );
}
