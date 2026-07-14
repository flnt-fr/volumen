// @vitest-environment happy-dom
import { render } from 'preact';
import { act } from 'preact/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LocaleProvider, useTranslation } from './context';
import { LOCALE_STORAGE_KEY } from './localeStore';

/**
 * Regression coverage for the locale-persistence divergence bug: the app's
 * LocaleProvider (this file) used to persist the resolved locale to
 * localStorage on every mount, including the very first auto-resolve from
 * navigator.language — silently "locking in" the browser-detected language as
 * if the visitor had explicitly chosen it. LocaleSelect.tsx (the static-page
 * equivalent) only ever persisted on an explicit user selection. These tests
 * pin LocaleProvider to the same explicit-choice-only behavior.
 */

function Probe() {
  const { locale, setLocale } = useTranslation();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button data-testid="set-fr" onClick={() => setLocale('fr')}>
        fr
      </button>
    </div>
  );
}

describe('LocaleProvider', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    window.localStorage.clear();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      render(null, container);
    });
    container.remove();
  });

  it('does not persist the auto-resolved locale to localStorage on mount', () => {
    act(() => {
      render(
        <LocaleProvider>
          <Probe />
        </LocaleProvider>,
        container,
      );
    });

    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull();
  });

  it('persists the locale only once the user explicitly changes it', () => {
    act(() => {
      render(
        <LocaleProvider>
          <Probe />
        </LocaleProvider>,
        container,
      );
    });
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull();

    act(() => {
      container.querySelector<HTMLButtonElement>('[data-testid="set-fr"]')?.click();
    });

    expect(container.querySelector('[data-testid="locale"]')?.textContent).toBe('fr');
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('fr');
  });
});
