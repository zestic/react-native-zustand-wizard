import { types } from 'mobx-state-tree';

// Import the StepModel from WizardStore
const StepModel = types
  .model('Step', {
    id: types.identifier,
    order: types.number,
    canMoveNext: types.boolean,
    nextLabel: types.optional(types.string, ''),
    previousLabel: types.optional(types.string, ''),
  })
  .actions((self) => ({
    setCanMoveNext(value: boolean) {
      self.canMoveNext = value;
    },
  }));

describe('StepModel', () => {
  it('creates with all fields', () => {
    const step = StepModel.create({
      id: 'step1',
      order: 1,
      canMoveNext: true,
      nextLabel: 'Next',
      previousLabel: 'Back',
    });
    expect(step.id).toBe('step1');
    expect(step.order).toBe(1);
    expect(step.canMoveNext).toBe(true);
    expect(step.nextLabel).toBe('Next');
    expect(step.previousLabel).toBe('Back');
  });

  it('creates with minimal fields (defaults)', () => {
    const step = StepModel.create({
      id: 'step2',
      order: 2,
      canMoveNext: false,
    });
    expect(step.id).toBe('step2');
    expect(step.order).toBe(2);
    expect(step.canMoveNext).toBe(false);
    expect(step.nextLabel).toBe(''); // default is empty string
    expect(step.previousLabel).toBe(''); // default is empty string
  });

  it('allows setting canMoveNext via action', () => {
    const step = StepModel.create({
      id: 'step3',
      order: 3,
      canMoveNext: false,
    });
    expect(step.canMoveNext).toBe(false);
    step.setCanMoveNext(true);
    expect(step.canMoveNext).toBe(true);
  });

  it('enforces required fields', () => {
    expect(() => StepModel.create({} as any)).toThrow();
    expect(() => StepModel.create({ id: 'step4' } as any)).toThrow();
    expect(() => StepModel.create({ order: 4 } as any)).toThrow();
    expect(() => StepModel.create({ id: 'step4', order: 4 } as any)).toThrow(); // missing canMoveNext
  });

  it('enforces type safety', () => {
    expect(() =>
      StepModel.create({
        id: 1,
        order: 'not-a-number',
        canMoveNext: false,
      } as any)
    ).toThrow();
    expect(() =>
      StepModel.create({ id: 'step5', order: 5, canMoveNext: 'yes' as any })
    ).toThrow();
  });

  it('snapshot matches expected structure', () => {
    const step = StepModel.create({
      id: 'step7',
      order: 7,
      canMoveNext: true,
    });
    const snap = JSON.parse(JSON.stringify(step));
    expect(snap).toEqual({
      id: 'step7',
      order: 7,
      canMoveNext: true,
      nextLabel: '',
      previousLabel: '',
    });
  });
});
