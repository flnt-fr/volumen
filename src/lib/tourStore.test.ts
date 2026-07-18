// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { TOUR_STORAGE_KEY, hasTourBeenSeen, markTourAsSeen } from './tourStore';

describe('tourStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('defaults to not seen when nothing is stored', () => {
    expect(hasTourBeenSeen()).toBe(false);
  });

  it('reports seen after markTourAsSeen() is called', () => {
    markTourAsSeen();
    expect(hasTourBeenSeen()).toBe(true);
  });

  it('persists the seen flag under the namespaced storage key', () => {
    markTourAsSeen();
    expect(window.localStorage.getItem(TOUR_STORAGE_KEY)).toBe('true');
  });

  it('treats any pre-existing non-"true" value as not seen', () => {
    window.localStorage.setItem(TOUR_STORAGE_KEY, 'false');
    expect(hasTourBeenSeen()).toBe(false);

    window.localStorage.setItem(TOUR_STORAGE_KEY, 'garbage');
    expect(hasTourBeenSeen()).toBe(false);
  });

  it('stays seen across repeated reads (persistence)', () => {
    markTourAsSeen();
    expect(hasTourBeenSeen()).toBe(true);
    expect(hasTourBeenSeen()).toBe(true);
  });
});

describe('tourStore outside the browser', () => {
  it('hasTourBeenSeen() returns false when window is undefined', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error simulating SSR
    delete globalThis.window;
    try {
      expect(hasTourBeenSeen()).toBe(false);
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it('markTourAsSeen() is a no-op when window is undefined', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error simulating SSR
    delete globalThis.window;
    try {
      expect(() => markTourAsSeen()).not.toThrow();
    } finally {
      globalThis.window = originalWindow;
    }
  });
});
