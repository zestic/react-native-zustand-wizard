import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { WizardStoreType } from '../../types/store';

export type ButtonProps = {
  label?: string;
  onPress: () => void;
  disabled: boolean;
};

export type NavigationButtonsProps = {
  store: WizardStoreType;
  onNext: () => void;
  onBack: () => void;
  renderNextButton?: ((props: ButtonProps) => React.ReactNode) | undefined;
  renderBackButton?: ((props: ButtonProps) => React.ReactNode) | undefined;
};

const DefaultButton: React.FC<ButtonProps> = ({ label, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.buttonDisabled]}
    onPress={onPress}
    disabled={disabled}
    testID={`${label?.toLowerCase()}-button`}
  >
    <Text style={styles.buttonContent}>
      {label}
    </Text>
  </TouchableOpacity>
);

export const NavigationButtons: React.FC<NavigationButtonsProps> = observer(({
  store,
  onNext,
  onBack,
  renderNextButton = (props: ButtonProps) => <DefaultButton {...props} label="Next" />,
  renderBackButton = (props: ButtonProps) => <DefaultButton {...props} label="Back" />
}) => {
  const canMoveNext = store.getCanMoveNext();
  const canMoveBack = store.getCanMoveBack();
  
  // Check if we're on the first visible step
  const currentStepIndex = store.getVisibleStepIndex();
  const isFirstStep = currentStepIndex === 0;
  
  // Check if the current step has hidden navigation
  const currentStep = store.getCurrentStep();
  const hideBackButton = isFirstStep || currentStep?.hidden === true;

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {!hideBackButton && renderBackButton({
          onPress: onBack,
          disabled: !canMoveBack
        })}
      </View>
      <View style={styles.buttonContainer}>
        {renderNextButton({
          onPress: onNext,
          disabled: !canMoveNext
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  buttonContainer: {
    marginLeft: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    minWidth: 100,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  buttonContent: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 