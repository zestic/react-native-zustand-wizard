import React from 'react';
import { ButtonProps, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import { WizardStoreType } from '../../stores/WizardStore';

export interface NavigationProps {
  store: WizardStoreType;
  onNext: () => void;
  onBack: () => void;
  renderNextButton: ((props: ButtonProps) => React.ReactNode) | null;
  renderBackButton: ((props: ButtonProps) => React.ReactNode) | null;
}

export const NavButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};


export const NavigationButtons = observer(({
  store,
  onNext,
  onBack,
  renderNextButton = null,
  renderBackButton = null
}: NavigationProps) => {
  const handleNext = () => {
    onNext();
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {!store.isFirstStep && (
          renderBackButton ? (
            renderBackButton({
              title: store.previousButtonLabel,
              onPress: handleBack,
              disabled: !store.getCanMoveBack()
            })
          ) : (
            <NavButton
              title={store.previousButtonLabel}
              onPress={handleBack}
              disabled={!store.getCanMoveBack()}
            />
          )
        )}
      </View>
      <View style={styles.buttonContainer}>
        {renderNextButton ? (
          renderNextButton({
            title: store.nextButtonLabel,
            onPress: handleNext,
            disabled: store.nextButtonDisabled
          })
        ) : (
          <NavButton
            title={store.nextButtonLabel}
            onPress={handleNext}
            disabled={store.nextButtonDisabled}
          />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#999999',
  },
}); 