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

  it('translates static-page keys used by the marketing pages', () => {
    expect(t('en', 'home.title')).toBe('Build a program your volume actually supports.');
    expect(t('fr', 'home.title')).toBe('Créez un programme que votre volume supporte vraiment.');
    expect(t('en', 'about.heading')).toBe('About Volumen');
    expect(t('fr', 'about.heading')).toBe('À propos de Volumen');
    expect(t('en', 'legal.heading')).toBe('Legal notice');
    expect(t('fr', 'legal.heading')).toBe('Mentions légales');
    expect(t('en', 'notFound.title')).toBe('404 — Page not found');
    expect(t('fr', 'notFound.title')).toBe('404 — Page introuvable');
  });
});
