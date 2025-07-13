import { useNavigationContext } from './wizardUtils';
import { renderHook } from '@testing-library/react-native';

// Mock the entire wizardUtils module
jest.mock('./wizardUtils', () => {
  const actual = jest.requireActual('./wizardUtils');
  return {
    ...actual,
    useNavigationContext: jest.fn(),
  };
});

describe('wizardUtils Navigation Tests', () => {
  const mockNav = require('./wizardUtils').useNavigationContext as jest.Mock;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('useNavigationContext', () => {
    it('should provide safe defaults when store is not initialized', () => {
      mockNav.mockReturnValueOnce({
        isPreviousHidden: true,
        isNextDisabled: false,
        nextLabel: '',
        previousLabel: '',
        currentStepPosition: 0,
        totalSteps: 0,
        onNext: expect.any(Function),
        onPrevious: expect.any(Function),
      });

      const { result } = renderHook(() => useNavigationContext());

      expect(result.current).toEqual({
        isPreviousHidden: true,
        isNextDisabled: false,
        nextLabel: '',
        previousLabel: '',
        currentStepPosition: 0,
        totalSteps: 0,
        onNext: expect.any(Function),
        onPrevious: expect.any(Function),
      });
    });
  });
});
