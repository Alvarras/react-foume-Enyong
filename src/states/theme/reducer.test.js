import { describe, it, expect } from 'vitest';
import themeReducer, { toggleTheme, setTheme } from './reducer';

describe('themeReducer', () => {
  it('should return the initial state when given an unknown action', () => {
    expect(themeReducer(undefined, { type: 'UNKNOWN' })).toBe('dark');
  });

  it('should handle toggleTheme action', () => {
    // toggle from dark to light
    expect(themeReducer('dark', toggleTheme())).toBe('light');
    // toggle from light to dark
    expect(themeReducer('light', toggleTheme())).toBe('dark');
  });

  it('should handle setTheme action', () => {
    expect(themeReducer('dark', setTheme('light'))).toBe('light');
    expect(themeReducer('light', setTheme('dark'))).toBe('dark');
  });
});
