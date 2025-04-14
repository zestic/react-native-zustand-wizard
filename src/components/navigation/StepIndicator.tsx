import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { StepProps, ConnectorProps, StepIndicatorProps } from '../../types/navigation';

const DefaultStep: React.FC<StepProps> = ({ index, isCompleted, isCurrent }) => (
  <View
    style={[
      styles.step,
      isCompleted && styles.completedStep,
      isCurrent && styles.currentStep
    ]}
    testID="step"
  >
    <Text style={styles.stepContent}>
      {isCompleted ? '✓' : index + 1}
    </Text>
  </View>
);

const DefaultConnector: React.FC<ConnectorProps> = ({ isCompleted }) => (
  <View
    style={[
      styles.connector,
      isCompleted && styles.completedConnector
    ]}
    testID="connector"
  />
);

export const StepIndicator: React.FC<StepIndicatorProps> = observer(({
  store,
  renderStep = DefaultStep,
  renderConnector = DefaultConnector
}) => {
  const steps = store.steps;
  const currentStepPosition = store.currentStepPosition;

  return (
    <View style={styles.container}>
      {steps.map((step: { id: string }, index: number) => {
        // A step is completed if it's before the current step
        const isCompleted = index < currentStepPosition;
        // A step is current if it's the current step
        const isCurrent = index === currentStepPosition;

        return (
          <React.Fragment key={step.id}>
            {renderStep({
              index,
              isCompleted,
              isCurrent,
              stepId: step.id
            })}
            {index < steps.length - 1 && (
              renderConnector({ isCompleted, index })
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedStep: {
    backgroundColor: '#4CAF50',
  },
  currentStep: {
    backgroundColor: '#2196F3',
  },
  stepContent: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connector: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  completedConnector: {
    backgroundColor: '#4CAF50',
  }
}); 