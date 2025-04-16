import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { WizardProps } from '../types';
import { WizardNavigation } from './navigation/WizardNavigation';
import { WizardStore } from '../stores/WizardStore';

export const Wizard = observer(({ 
  steps,
  nextLabel = 'Next',
  previousLabel = 'Back',
  finishLabel = 'Finish',
  renderLoading,
  renderNavigation
}: WizardProps) => {
  const componentRegistry = useMemo(() => {
    const registry = new Map<string, React.ComponentType<any>>();
    steps.forEach(step => {
      registry.set(step.id, step.component);
    });
    return registry;
  }, [steps]);

  const store = useMemo(() => {
    const lastStepOrder = Math.max(...steps.map(s => s.order), 0);

    if (!Array.isArray(steps) || steps.length === 0) {
      throw new Error('Wizard must have at least one step');
    }

    const processedSteps = steps.map(step => {
      const isLast = step.order === lastStepOrder;
      return {
        id: step.id,
        order: step.order,
        canMoveNext: step.canMoveNext ?? false,
        nextLabel: step.nextLabel ?? (isLast ? finishLabel : nextLabel),
        previousLabel: step.previousLabel ?? previousLabel,
      };
    });

    return WizardStore.create({
      steps: processedSteps
    });
  }, [steps, nextLabel, previousLabel, finishLabel]);

  const CurrentStepComponent = componentRegistry.get(store.currentStepId);

  if (store.isLoading) {
    return renderLoading ? renderLoading() : <View style={styles.loading}><Text>Loading...</Text></View>;
  }

  if (store.error) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>{store.error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {CurrentStepComponent && (
        <CurrentStepComponent store={store} />
      )}

      {renderNavigation ? (
        renderNavigation(store)
      ) : (
        <WizardNavigation store={store} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  loading: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
