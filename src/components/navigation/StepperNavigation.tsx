import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { WizardStoreType } from '../../types/store';
import { StepIndicator } from './StepIndicator';
import { NavigationButtons } from './NavigationButtons';
import { StepProps, ConnectorProps } from '../../types/navigation';
import { ButtonProps } from 'react-native';

export type StepperNavigationProps = {
  store: WizardStoreType;
  onNext: () => void;
  onBack: () => void;
  renderStep?: ((props: StepProps) => React.ReactNode) | undefined;
  renderConnector?: ((props: ConnectorProps) => React.ReactNode) | undefined;
  renderNextButton: ((props: ButtonProps) => React.ReactNode) | null;
  renderBackButton: ((props: ButtonProps) => React.ReactNode) | null;
};

export const StepperNavigation: React.FC<StepperNavigationProps> = observer(({
  store,
  onNext,
  onBack,
  renderStep = undefined,
  renderConnector = undefined,
  renderNextButton = null,
  renderBackButton = null
}) => {
  return (
    <View style={styles.container}>
      <StepIndicator
        store={store}
        renderStep={renderStep}
        renderConnector={renderConnector}
      />
      <NavigationButtons
        store={store}
        onNext={onNext}
        onBack={onBack}
        renderNextButton={renderNextButton}
        renderBackButton={renderBackButton}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
