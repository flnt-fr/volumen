import { describe, expect, it } from 'vitest';
import en from './strings.en';
import fr from './strings.fr';
import { t } from './t';

describe('t', () => {
  it('looks up a translation for the given locale', () => {
    expect(t('en', 'sessions.heading')).toBe('Sessions');
    expect(t('fr', 'sessions.heading')).toBe('Séances');
  });

  it('has full French coverage of every English UI key', () => {
    const missing = Object.keys(en).filter((key) => !(key in fr));
    expect(missing).toEqual([]);
  });


  it('interpolates {param} placeholders', () => {
    expect(t('en', 'sessions.defaultName', { index: 2 })).toBe('Session 2');
    expect(t('fr', 'sessions.defaultName', { index: 2 })).toBe('Séance 2');
  });

  it('leaves unresolved placeholders untouched', () => {
    expect(t('en', 'sessions.defaultName')).toBe('Session {index}');
  });
});
