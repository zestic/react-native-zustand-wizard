import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { useNavigationContext } from '../../utils/wizardUtils';

export const StepIndicator: React.FC = () => {
  const { currentStepPosition, totalSteps } = useNavigationContext();
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = step < currentStepPosition;
        const isCurrent = step === currentStepPosition;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step}>
            <View
              style={[
                styles.step,
                isCompleted && styles.stepCompleted,
                isCurrent && styles.stepCurrent,
              ]}
            />
            {!isLast && (
              <View
                style={[
                  styles.connector,
                  isCompleted && styles.connectorCompleted,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  connector: {
    backgroundColor: colors.gray300,
    height: 2,
    marginHorizontal: 4,
    width: 20,
  },
  connectorCompleted: {
    backgroundColor: colors.secondary,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  step: {
    backgroundColor: colors.gray300,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  stepCompleted: {
    backgroundColor: colors.secondary,
  },
  stepCurrent: {
    backgroundColor: colors.primary,
  },
});
