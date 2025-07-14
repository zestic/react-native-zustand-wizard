import * as utilsIndex from './index';
import * as wizardUtils from './wizardUtils';
import * as types from '../types';

// Mock the wizardUtils module
jest.mock('./wizardUtils', () => ({
  useStepContext: jest.fn(),
  useNavigationContext: jest.fn(),
}));

describe('utils/index.ts', () => {
  describe('Function Exports', () => {
    it('should export useStepContext', () => {
      expect(utilsIndex.useStepContext).toBeDefined();
      expect(typeof utilsIndex.useStepContext).toBe('function');
    });

    it('should export useNavigationContext', () => {
      expect(utilsIndex.useNavigationContext).toBeDefined();
      expect(typeof utilsIndex.useNavigationContext).toBe('function');
    });

    it('should re-export functions from wizardUtils', () => {
      expect(utilsIndex.useStepContext).toBe(wizardUtils.useStepContext);
      expect(utilsIndex.useNavigationContext).toBe(
        wizardUtils.useNavigationContext
      );
    });
  });

  describe('Type Exports', () => {
    it('should export NavigationContext type', () => {
      // Test that the type is available for use
      const mockNavigationContext: utilsIndex.NavigationContext = {
        isPreviousHidden: false,
        isNextDisabled: false,
        nextLabel: 'Next',
        previousLabel: 'Previous',
        currentStepPosition: 1,
        totalSteps: 3,
        onNext: async () => {},
        onPrevious: async () => {},
      };

      expect(mockNavigationContext).toBeDefined();
      expect(typeof mockNavigationContext.isPreviousHidden).toBe('boolean');
      expect(typeof mockNavigationContext.isNextDisabled).toBe('boolean');
      expect(typeof mockNavigationContext.nextLabel).toBe('string');
      expect(typeof mockNavigationContext.previousLabel).toBe('string');
      expect(typeof mockNavigationContext.currentStepPosition).toBe('number');
      expect(typeof mockNavigationContext.totalSteps).toBe('number');
      expect(typeof mockNavigationContext.onNext).toBe('function');
      expect(typeof mockNavigationContext.onPrevious).toBe('function');
    });

    it('should export StepContext type', () => {
      // Test that the type is available for use
      const mockStepContext: utilsIndex.StepContext = {
        stepId: 'test-step',
        updateField: (field: string, value: unknown) => {},
        getStepData: () => ({ name: 'test' }),
        canMoveNext: (canMove: boolean) => {},
      };

      expect(mockStepContext).toBeDefined();
      expect(typeof mockStepContext.stepId).toBe('string');
      expect(typeof mockStepContext.updateField).toBe('function');
      expect(typeof mockStepContext.getStepData).toBe('function');
      expect(typeof mockStepContext.canMoveNext).toBe('function');
    });

    it('should re-export types from types module', () => {
      // Verify that the types are the same as those from the types module
      // This is more of a structural test since TypeScript types don't exist at runtime

      // Test NavigationContext structure
      const navContext: utilsIndex.NavigationContext = {
        isPreviousHidden: true,
        isNextDisabled: false,
        nextLabel: 'Continue',
        previousLabel: 'Back',
        currentStepPosition: 2,
        totalSteps: 5,
        onNext: async () => Promise.resolve(),
        onPrevious: async () => Promise.resolve(),
      };

      // Test StepContext structure
      const stepContext: utilsIndex.StepContext = {
        stepId: 'step-1',
        updateField: jest.fn(),
        getStepData: jest.fn(() => ({})),
        canMoveNext: jest.fn(),
      };

      expect(navContext.currentStepPosition).toBe(2);
      expect(stepContext.stepId).toBe('step-1');
    });
  });

  describe('Module Structure', () => {
    it('should export exactly the expected items', () => {
      const exportedKeys = Object.keys(utilsIndex);
      const expectedExports = ['useStepContext', 'useNavigationContext'];

      expectedExports.forEach((exportName) => {
        expect(exportedKeys).toContain(exportName);
      });
    });

    it('should not export unexpected items', () => {
      const exportedKeys = Object.keys(utilsIndex);
      const expectedExports = ['useStepContext', 'useNavigationContext'];

      expect(exportedKeys).toHaveLength(expectedExports.length);
    });

    it('should be a proper ES module', () => {
      expect(typeof utilsIndex).toBe('object');
      expect(utilsIndex).not.toBeNull();
    });
  });

  describe('Function Behavior', () => {
    it('should call the original useStepContext when invoked', () => {
      const mockStepId = 'test-step';
      const mockReturn = {
        stepId: mockStepId,
        updateField: jest.fn(),
        getStepData: jest.fn(),
        canMoveNext: jest.fn(),
      };

      (wizardUtils.useStepContext as jest.Mock).mockReturnValue(mockReturn);

      const result = utilsIndex.useStepContext(mockStepId);

      expect(wizardUtils.useStepContext).toHaveBeenCalledWith(mockStepId);
      expect(result).toBe(mockReturn);
    });

    it('should call the original useNavigationContext when invoked', () => {
      const mockReturn = {
        isPreviousHidden: false,
        isNextDisabled: true,
        nextLabel: 'Next',
        previousLabel: 'Previous',
        currentStepPosition: 1,
        totalSteps: 3,
        onNext: jest.fn(),
        onPrevious: jest.fn(),
      };

      (wizardUtils.useNavigationContext as jest.Mock).mockReturnValue(
        mockReturn
      );

      const result = utilsIndex.useNavigationContext();

      expect(wizardUtils.useNavigationContext).toHaveBeenCalled();
      expect(result).toBe(mockReturn);
    });
  });

  describe('Type Compatibility', () => {
    it('should allow NavigationContext to be used in function signatures', () => {
      const processNavigationContext = (
        context: utilsIndex.NavigationContext
      ): string => {
        return `Step ${context.currentStepPosition} of ${context.totalSteps}`;
      };

      const mockContext: utilsIndex.NavigationContext = {
        isPreviousHidden: false,
        isNextDisabled: false,
        nextLabel: 'Next',
        previousLabel: 'Previous',
        currentStepPosition: 2,
        totalSteps: 4,
        onNext: async () => {},
        onPrevious: async () => {},
      };

      const result = processNavigationContext(mockContext);
      expect(result).toBe('Step 2 of 4');
    });

    it('should allow StepContext to be used in function signatures', () => {
      const processStepContext = (context: utilsIndex.StepContext): string => {
        return context.stepId;
      };

      const mockContext: utilsIndex.StepContext = {
        stepId: 'user-info',
        updateField: jest.fn(),
        getStepData: jest.fn(() => ({})),
        canMoveNext: jest.fn(),
      };

      const result = processStepContext(mockContext);
      expect(result).toBe('user-info');
    });

    it('should work with async functions', async () => {
      const mockNavigationContext: utilsIndex.NavigationContext = {
        isPreviousHidden: false,
        isNextDisabled: false,
        nextLabel: 'Next',
        previousLabel: 'Previous',
        currentStepPosition: 1,
        totalSteps: 3,
        onNext: jest.fn().mockResolvedValue(undefined),
        onPrevious: jest.fn().mockResolvedValue(undefined),
      };

      await expect(mockNavigationContext.onNext()).resolves.toBeUndefined();
      await expect(mockNavigationContext.onPrevious()).resolves.toBeUndefined();
    });
  });

  describe('Import/Export Consistency', () => {
    it('should maintain consistent exports with wizardUtils', () => {
      // Verify that all expected exports from wizardUtils are re-exported
      expect(utilsIndex.useStepContext).toBe(wizardUtils.useStepContext);
      expect(utilsIndex.useNavigationContext).toBe(
        wizardUtils.useNavigationContext
      );
    });

    it('should not expose internal implementation details', () => {
      // Verify that only the intended public API is exposed
      const exportedKeys = Object.keys(utilsIndex);

      // Should not export things like updateField directly (it's meant to be used via useStepContext)
      expect(exportedKeys).not.toContain('updateField');

      // Should only export the public hooks
      expect(exportedKeys.sort()).toEqual([
        'useNavigationContext',
        'useStepContext',
      ]);
    });
  });

  describe('Documentation and Comments', () => {
    it('should serve as a proper barrel export', () => {
      // This test verifies that the index file serves its purpose as a barrel export
      // by providing a clean public API

      // All expected utilities should be available
      expect(utilsIndex.useStepContext).toBeDefined();
      expect(utilsIndex.useNavigationContext).toBeDefined();

      // Types should be available for import (tested through usage)
      const testNavContext: utilsIndex.NavigationContext = {
        isPreviousHidden: false,
        isNextDisabled: false,
        nextLabel: 'Next',
        previousLabel: 'Previous',
        currentStepPosition: 1,
        totalSteps: 1,
        onNext: async () => {},
        onPrevious: async () => {},
      };

      const testStepContext: utilsIndex.StepContext = {
        stepId: 'test',
        updateField: () => {},
        getStepData: () => ({}),
        canMoveNext: () => {},
      };

      expect(testNavContext).toBeDefined();
      expect(testStepContext).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from underlying functions', () => {
      const testError = new Error('Test error');
      (wizardUtils.useStepContext as jest.Mock).mockImplementation(() => {
        throw testError;
      });

      expect(() => {
        utilsIndex.useStepContext('test-step');
      }).toThrow('Test error');
    });

    it('should handle undefined returns gracefully', () => {
      (wizardUtils.useNavigationContext as jest.Mock).mockReturnValue(
        undefined
      );

      const result = utilsIndex.useNavigationContext();
      expect(result).toBeUndefined();
    });
  });
});
