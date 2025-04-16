import { types } from 'mobx-state-tree';

export const StepModel = types
  .model('StepModel', {
    id: types.identifier,
    order: types.number,
    canMoveNext: types.optional(types.boolean, false),
    nextLabel: types.maybe(types.string),
    previousLabel: types.maybe(types.string),
  })
  .views((self) => ({
    get isComplete() {
      return self.canMoveNext;
    },
  }));
