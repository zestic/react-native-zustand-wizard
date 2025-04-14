import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ButtonProps } from 'react-native';
import { observer } from 'mobx-react-lite';
import { WizardProps } from '../types';
import { NavButton, NavigationButtons, NavigationProps } from './navigation/NavigationButtons';
import { WizardStore } from '../stores/WizardStore';

type WizardComponentProps = Omit<WizardProps, 'store'>;

export const Wizard = observer(({ 
  steps,
  nextLabel = 'Next',
  previousLabel = 'Back',
  finishLabel = 'Finish',
  renderStep,
  renderNextButton = () => null,
  renderBackButton = () => null,
  renderLoading,
  renderNavigation
}: WizardComponentProps) => {
  const store = useMemo(() => {
    console.log('Wizard steps:', steps);
    const lastStepOrder = Math.max(...steps.map(s => s.order), 0);

    if (!Array.isArray(steps) || steps.length === 0) {
      throw new Error('Wizard must have at least one step');
    }

    const processedSteps = steps.map(step => {
      console.log('Processing step:', step);
      const isLast = step.order === lastStepOrder;
      return {
        ...step,
        nextLabel: step.nextLabel ?? (isLast ? finishLabel : nextLabel),
        previousLabel: step.previousLabel ?? previousLabel,
        canMoveNext: step.canMoveNext ?? false,
      };
    });

    console.log('Creating store with steps:', processedSteps);
    return WizardStore.create({
      steps: processedSteps,
      stepData: {},
      isLoading: false,
      error: ''
    });
  }, [steps, nextLabel, previousLabel, finishLabel]);

  const currentStep = store.getCurrentStep();
  const CurrentStepComponent = currentStep?.component;

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

  const defaultRenderNext = (props: ButtonProps) => <NavButton {...props} />;
  const defaultRenderBack = (props: ButtonProps) => <NavButton {...props} />;

  const navigationProps: NavigationProps = {
    store,
    onNext: () => store.moveNext(),
    onBack: () => store.moveBack(),
    renderNextButton: renderNextButton || defaultRenderNext,
    renderBackButton: renderBackButton || defaultRenderBack
  };

  return (
    <View style={styles.container}>
      {currentStep && CurrentStepComponent && (
        renderStep ? (
           renderStep({ currentStep, store })
        ) : (
          <CurrentStepComponent store={store} />
        )
      )}

      {renderNavigation ? (
        renderNavigation(navigationProps)
      ) : (
        <NavigationButtons {...navigationProps} />
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
