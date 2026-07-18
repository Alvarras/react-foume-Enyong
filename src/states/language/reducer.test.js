import { describe, it, expect } from 'vitest';
import languageReducer, { toggleLanguage, setLanguage } from './reducer';

describe('languageReducer', () => {
  it('should return the initial state when given an unknown action', () => {
    expect(languageReducer(undefined, { type: 'UNKNOWN' })).toBe('en');
  });

  it('should handle toggleLanguage action', () => {
    // toggle from en to id
    expect(languageReducer('en', toggleLanguage())).toBe('id');
    // toggle from id to en
    expect(languageReducer('id', toggleLanguage())).toBe('en');
  });

  it('should handle setLanguage action', () => {
    expect(languageReducer('en', setLanguage('id'))).toBe('id');
    expect(languageReducer('id', setLanguage('en'))).toBe('en');
  });
});
