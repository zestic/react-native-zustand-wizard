import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigationContext } from '../../utils/wizardUtils';

interface StepIndicatorProps {
  style?: any;
}

const StepIndicator: React.FC<StepIndicatorProps> = observer(({ style }) => {
  const { currentStepPosition, totalSteps } = useNavigationContext();

  const renderStep = (index: number) => {
    const isCompleted = index < currentStepPosition - 1;
    const isCurrent = index === currentStepPosition - 1;

    return (
      <View
        key={`step-${index}`}
        testID="step"
        style={[
          styles.step,
          isCompleted && styles.completedStep,
          isCurrent && styles.currentStep
        ]}
      />
    );
  };

  const renderConnector = (index: number) => {
    const isCompleted = index < currentStepPosition - 1;
    return (
      <View
        key={`connector-${index}`}
        testID="connector"
        style={[styles.connector, isCompleted && styles.completedConnector]}
      />
    );
  };

  return (
    <View testID="step-indicator" style={[styles.container, style]}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          {renderStep(index)}
          {index < totalSteps - 1 && renderConnector(index)}
        </React.Fragment>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  step: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4
  },
  completedStep: {
    backgroundColor: '#4CAF50'
  },
  currentStep: {
    backgroundColor: '#2196F3'
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4
  },
  completedConnector: {
    backgroundColor: '#4CAF50'
  }
});

export { StepIndicator }; 