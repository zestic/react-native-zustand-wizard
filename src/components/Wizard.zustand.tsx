import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WizardProps } from '../types';
import { WizardNavigationZustand } from './navigation/WizardNavigation.zustand';
import { WizardProvider, useWizard } from '../context/WizardContext';
import { colors } from '../theme/colors';

// Internal component that uses the Zustand store
const WizardContent: React.FC<Omit<WizardProps, 'steps'>> = ({
  renderLoading,
  renderNavigation,
}) => {
  const store = useWizard();

  const componentRegistry = useMemo(() => {
    const registry = new Map<
      string,
      React.ComponentType<Record<string, unknown>>
    >();
    store.steps.forEach((step) => {
      // We need to find the original step with component from props
      // For now, we'll assume the component is passed via the step
      // This will need to be handled differently in the full migration
      registry.set(step.id, () => <Text>Step {step.id}</Text>);
    });
    return registry;
  }, [store.steps]);

  const CurrentStepComponent = componentRegistry.get(store.currentStepId);

  if (store.isLoading) {
    return renderLoading ? (
      renderLoading()
    ) : (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
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
      {CurrentStepComponent && <CurrentStepComponent store={store} />}

      {renderNavigation ? (
        React.createElement(renderNavigation())
      ) : (
        <WizardNavigationZustand />
      )}
    </View>
  );
};

// Main Wizard component that provides the Zustand context
export const WizardZustand: React.FC<WizardProps> = ({
  steps,
  nextLabel = 'Next',
  previousLabel = 'Back',
  finishLabel = 'Finish',
  renderLoading,
  renderNavigation,
}) => {
  // Process steps to extract the data needed for Zustand store
  const processedSteps = useMemo(() => {
    if (!Array.isArray(steps) || steps.length === 0) {
      throw new Error('Wizard must have at least one step');
    }

    const lastStepOrder = Math.max(...steps.map((s) => s.order), 0);

    return steps.map((step) => {
      const isLast = step.order === lastStepOrder;
      return {
        id: step.id,
        order: step.order,
        canMoveNext: step.canMoveNext ?? false,
        // Store the component reference separately since Zustand store doesn't need it
        component: step.component,
      };
    });
  }, [steps]);

  // Create a component registry that can be accessed by the WizardContent
  const componentRegistry = useMemo(() => {
    const registry = new Map<
      string,
      React.ComponentType<Record<string, unknown>>
    >();
    processedSteps.forEach((step) => {
      registry.set(step.id, step.component);
    });
    return registry;
  }, [processedSteps]);

  return (
    <WizardProvider
      steps={processedSteps.map(({ component, ...step }) => step)}
      nextLabel={nextLabel}
      previousLabel={previousLabel}
      finishLabel={finishLabel}
    >
      <WizardContentWithRegistry
        componentRegistry={componentRegistry}
        renderLoading={renderLoading}
        renderNavigation={renderNavigation}
      />
    </WizardProvider>
  );
};

// Component that has access to both the store and component registry
const WizardContentWithRegistry: React.FC<{
  componentRegistry: Map<string, React.ComponentType<Record<string, unknown>>>;
  renderLoading?: () => React.ReactElement;
  renderNavigation?: () => React.ComponentType;
}> = ({ componentRegistry, renderLoading, renderNavigation }) => {
  const store = useWizard();

  const CurrentStepComponent = componentRegistry.get(store.currentStepId);

  if (store.isLoading) {
    return renderLoading ? (
      renderLoading()
    ) : (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
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
      {CurrentStepComponent && <CurrentStepComponent store={store} />}

      {renderNavigation ? (
        React.createElement(renderNavigation())
      ) : (
        <WizardNavigationZustand />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  error: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
