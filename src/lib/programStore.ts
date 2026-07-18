import { parseStoredProgram } from './programFile';
import type { Program } from './types';

export const PROGRAM_STORAGE_KEY = 'volumen:program';

/**
 * SSR-guarded localStorage wrapper for the current program, mirroring
 * src/lib/tourStore.ts and src/i18n/localeStore.ts's pattern rather than
 * reading/writing window.localStorage inline in ProgramBuilder.tsx.
 */

/** Returns the stored program, or null if there is none / it's server-side / it fails to parse. */
export async function loadStoredProgram(): Promise<Program | null> {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(PROGRAM_STORAGE_KEY);
  if (!stored) return null;
  try {
    return await parseStoredProgram(JSON.parse(stored));
  } catch {
    return null;
  }
}

/**
 * Persists the program. No-op server-side. Swallows quota/availability
 * errors (e.g. private browsing, storage full) rather than letting them
 * surface as an unhandled exception on every keystroke — losing the ability
 * to persist is degraded, not fatal, for this app.
 */
export function saveProgram(program: Program): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(program));
  } catch {
    // Storage unavailable or full — the in-memory program still works for
    // the rest of the session, it just won't survive a reload.
  }
}
