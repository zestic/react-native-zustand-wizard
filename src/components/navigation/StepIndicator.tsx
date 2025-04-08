import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { WizardStoreType } from '../../types/store';

export type StepProps = {
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  stepId: string;
};

export type ConnectorProps = {
  index: number;
  isCompleted: boolean;
};

export type StepIndicatorProps = {
  store: WizardStoreType;
  renderStep?: ((props: StepProps) => React.ReactNode) | undefined;
  renderConnector?: ((props: ConnectorProps) => React.ReactNode) | undefined;
};

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
  const visibleSteps = store.getVisibleSteps();
  const currentStepIndex = store.getCurrentStepIndex();

  return (
    <View style={styles.container}>
      {visibleSteps.map((step, index) => {
        const isCompleted = store.completedSteps.includes(step.id);
        const isCurrent = index === currentStepIndex;

        return (
          <React.Fragment key={step.id}>
            {renderStep({
              index,
              isCompleted,
              isCurrent,
              stepId: step.id
            })}
            {index < visibleSteps.length - 1 && (
              renderConnector({
                index,
                isCompleted
              })
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
    marginHorizontal: 4,
  },
  completedConnector: {
    backgroundColor: '#4CAF50',
  },
}); 