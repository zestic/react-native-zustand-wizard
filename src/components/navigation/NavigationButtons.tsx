import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from '../../theme/colors';

export interface NavigationButtonsProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  testID?: string;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      {!isFirstStep && (
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={onBack}
          testID="back-button"
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.button, styles.nextButton]}
        onPress={onNext}
        testID="next-button"
      >
        <Text style={styles.buttonText}>{isLastStep ? 'Finish' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: colors.gray200,
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    minWidth: 100,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
});
