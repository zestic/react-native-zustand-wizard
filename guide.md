# React Native Zustand Wizard - Migration Guide

## Overview

This guide outlines the complete strategy for migrating the React Native MST Wizard from MobX State Tree (MST) to Zustand state management. The migration maintains all existing functionality while modernizing the state management approach.

## Current State Analysis

### MST Implementation Summary
- **Main Store**: `WizardStore.ts` with nested `StepModel`
- **Dependencies**: mobx, mobx-react-lite, mobx-state-tree
- **Test Coverage**: 91.41% (63 tests passing) ✅
- **Key Features**: Step navigation, data management, validation, error handling

### Pre-Migration Status ✅
- All tests are passing (63/63)
- Test coverage is excellent at 91.41%
- MST implementation is stable and ready for migration
- Added additional test for error handling edge cases

### MST Patterns Used
1. **Store Definition**: `types.model()` with properties and actions
2. **Computed Values**: Views like `canMoveNext`, `isFirstStep`
3. **Async Actions**: `setCurrentStep`, `moveNext`, `updateField`
4. **Observers**: Components wrapped with `observer()`
5. **Type Safety**: `Instance<typeof Store>` patterns
6. **Lifecycle**: `afterCreate()` hooks
7. **Data Storage**: `types.map()` for stepData

## Migration Strategy

### Phase 1: Preparation & Setup (Week 1)
**Objectives**: Set up Zustand infrastructure alongside existing MST

**Tasks**:
- [ ] Install Zustand dependencies
- [ ] Create parallel Zustand store structure
- [ ] Set up new test files for Zustand implementation
- [ ] Ensure all existing MST tests pass (baseline)
- [ ] Create migration validation scripts

**Deliverables**:
- Updated `package.json` with Zustand dependencies
- Initial Zustand store skeleton
- Test infrastructure for parallel testing

### Phase 2: Core Store Migration (Week 2)
**Objectives**: Replace MST store with Zustand equivalent

**Tasks**:
- [ ] Implement Zustand WizardStore with all state properties
- [ ] Migrate all MST actions to Zustand actions
- [ ] Convert MST views to Zustand selectors
- [ ] Update type definitions and interfaces
- [ ] Create comprehensive store tests

**Key Migrations**:
```typescript
// MST Pattern
const WizardStore = types.model('WizardStore', {
  currentStepId: types.optional(types.string, ''),
  // ...
}).actions(self => ({
  setCurrentStep: async (stepId: string) => { /* ... */ }
})).views(self => ({
  get canMoveNext() { /* ... */ }
}))

// Zustand Pattern
interface WizardState {
  currentStepId: string;
  setCurrentStep: (stepId: string) => Promise<void>;
  canMoveNext: boolean;
}

const useWizardStore = create<WizardState>((set, get) => ({
  currentStepId: '',
  setCurrentStep: async (stepId) => { /* ... */ },
  get canMoveNext() { /* ... */ }
}))
```

### Phase 3: Component Migration (Week 3)
**Objectives**: Update all components to use Zustand

**Tasks**:
- [ ] Remove `observer()` wrappers from components
- [ ] Update components to use Zustand hooks
- [ ] Migrate `wizardUtils.ts` functions
- [ ] Update navigation context hooks
- [ ] Test component integration

**Component Updates**:
```typescript
// Before (MST)
export const Wizard = observer(({ steps }) => {
  const store = useMemo(() => WizardStore.create({ steps }), [steps]);
  // ...
});

// After (Zustand)
export const Wizard = ({ steps }) => {
  const store = useWizardStore();
  // ...
};
```

### Phase 4: Testing & Validation (Week 4)
**Objectives**: Ensure complete test coverage and functionality

**Tasks**:
- [ ] Migrate all test files to Zustand patterns
- [ ] Validate test coverage remains ≥90%
- [ ] Update example components
- [ ] Performance testing and optimization
- [ ] Integration testing

**Test Migration Pattern**:
```typescript
// Before (MST)
const store = WizardStore.create({ steps: defaultSteps });

// After (Zustand) - using @testing-library/react-native
import { renderHook, act } from '@testing-library/react-native';
const { result } = renderHook(() => useWizardStore());
```

### Phase 5: Cleanup & Finalization (Week 5)
**Objectives**: Remove MST dependencies and finalize migration

**Tasks**:
- [ ] Remove MST dependencies from package.json
- [ ] Delete old MST code files
- [ ] Update README and documentation
- [ ] Update peer dependencies
- [ ] Final validation and testing

## Technical Implementation Details

### Zustand Store Structure
```typescript
interface WizardState {
  // Core State
  currentStepId: string;
  currentStepPosition: number;
  isLoading: boolean;
  error: string;
  stepData: Map<string, Record<string, unknown>>;
  steps: Step[];
  totalSteps: number;
  
  // Actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentStep: (stepId: string) => Promise<void>;
  moveNext: () => Promise<void>;
  moveBack: () => Promise<void>;
  setStepData: (stepId: string, data: Record<string, unknown>) => Promise<void>;
  updateField: (stepId: string, field: string, value: unknown) => Promise<void>;
  reset: () => Promise<void>;
  
  // Selectors (Computed Values)
  canMoveNext: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextButtonLabel: string;
  previousButtonLabel: string;
  getCurrentStep: () => Step | undefined;
  getNextStep: () => Step | undefined;
  getPreviousStep: () => Step | undefined;
  getStepData: (stepId: string) => Record<string, unknown>;
  getStepById: (stepId: string) => Step | undefined;
}
```

### Key Migration Patterns

#### 1. Store Creation
```typescript
// MST
const store = WizardStore.create({ steps });

// Zustand
const useWizardStore = create<WizardState>((set, get) => ({
  // Initial state
  currentStepId: '',
  steps: [],
  // Actions
  setCurrentStep: async (stepId) => {
    const step = get().steps.find(s => s.id === stepId);
    if (step) {
      set({ currentStepId: stepId, currentStepPosition: step.order });
    }
  },
  // Selectors
  get canMoveNext() {
    const state = get();
    const currentStep = state.steps.find(s => s.id === state.currentStepId);
    return currentStep?.canMoveNext ?? false;
  }
}));
```

#### 2. Component Usage
```typescript
// MST
const Component = observer(() => {
  const { store } = useContext(StoreContext);
  return <div>{store.currentStepId}</div>;
});

// Zustand
const Component = () => {
  const currentStepId = useWizardStore(state => state.currentStepId);
  return <div>{currentStepId}</div>;
};
```

#### 3. Utility Functions
```typescript
// MST
export const updateField = (stepId: string, field: string, value: unknown) => {
  wizardStore.updateField(stepId, field, value);
};

// Zustand
export const updateField = (stepId: string, field: string, value: unknown) => {
  useWizardStore.getState().updateField(stepId, field, value);
};
```

## Risk Mitigation

### Technical Risks
1. **Reactivity Changes**: Ensure all reactive updates work with Zustand hooks
2. **Performance**: Use selectors to prevent unnecessary re-renders
3. **Type Safety**: Maintain strict TypeScript typing throughout
4. **Async Actions**: Proper error handling in Zustand actions
5. **Testing**: Comprehensive test coverage during migration

### Migration Risks
1. **API Breaking Changes**: Maintain existing API contracts
2. **Behavioral Differences**: Validate identical behavior between MST and Zustand
3. **Test Coverage Loss**: Monitor coverage throughout migration
4. **Performance Regression**: Benchmark before and after migration

## Success Criteria

- [ ] All existing functionality preserved
- [ ] Test coverage maintained at ≥91% (current: 91.41%)
- [ ] All 63+ tests passing (current: 63/63 ✅)
- [ ] No performance regressions
- [ ] Clean removal of MST dependencies
- [ ] Updated documentation and examples
- [ ] Successful example app functionality

## Current Test Coverage Details

### Coverage by Module
- **Overall**: 91.41% statements, 80.74% branches, 94.52% functions
- **Components**: 95.45% (Wizard.tsx and navigation components)
- **Stores**: 87.06% (WizardStore.ts - main focus for migration)
- **Utils**: 97.18% (wizardUtils.ts - utility functions)
- **Types**: 0% (type definitions only, no executable code)

### Test Files (63 tests total)
- `WizardStore.test.ts` - 21 tests (store functionality)
- `Wizard.test.tsx` - 14 tests (main component)
- `WizardNavigation.test.tsx` - 13 tests (navigation component)
- `StepIndicator.test.tsx` - 1 test (indicator component)
- `useNavigationContext.test.ts` - 2 tests (navigation hook)
- `wizardUtils.test.ts` - 6 tests (utility functions)
- `wizardUtils.integration.test.ts` - 3 tests (integration)
- `wizardUtils.unit.test.ts` - 3 tests (unit tests)
- `StepModel.test.ts` - 3 tests (step model)

## Dependencies

### Remove (MST)
```json
{
  "mobx": ">=6.12.0",
  "mobx-react-lite": ">=4.0.5",
  "mobx-state-tree": ">=7.0.2"
}
```

### Add (Zustand)
```json
{
  "zustand": "^4.4.0"
}
```

## Timeline Summary

| Week | Phase | Focus | Deliverables |
|------|-------|-------|--------------|
| 1 | Setup | Infrastructure | Zustand setup, parallel testing |
| 2 | Core | Store migration | Complete Zustand store |
| 3 | Components | UI migration | Updated components |
| 4 | Testing | Validation | Full test coverage |
| 5 | Cleanup | Finalization | Production-ready code |

## Next Steps

1. **✅ Completed**: Run current test suite to establish baseline (91.41% coverage, 63/63 tests passing)
2. **Week 1**: Begin Phase 1 setup tasks
   - Install Zustand dependencies
   - Create parallel Zustand store structure
   - Set up new test files for Zustand implementation
3. **Ongoing**: Monitor test coverage and functionality throughout migration
4. **Final**: Validate complete migration success before MST removal

## Ready for Migration ✅

The project is now ready to begin the MST to Zustand migration:
- ✅ All tests passing (63/63)
- ✅ Excellent test coverage (91.41%)
- ✅ Stable MST implementation
- ✅ Comprehensive migration strategy documented
- ✅ Risk mitigation strategies in place

This migration guide ensures a systematic, low-risk transition from MST to Zustand while maintaining all existing functionality and test coverage.
