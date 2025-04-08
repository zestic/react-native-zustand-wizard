import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { WizardStoreType } from '../../types/store';
import { StepIndicator, StepProps, ConnectorProps } from './StepIndicator';
import { NavigationButtons, ButtonProps } from './NavigationButtons';

export type StepperNavigationProps = {
  store: WizardStoreType;
  onNext: () => void;
  onBack: () => void;
  renderStep?: ((props: StepProps) => React.ReactNode) | undefined;
  renderConnector?: ((props: ConnectorProps) => React.ReactNode) | undefined;
  renderNextButton?: ((props: ButtonProps) => React.ReactNode) | undefined;
  renderBackButton?: ((props: ButtonProps) => React.ReactNode) | undefined;
};

export const StepperNavigation: React.FC<StepperNavigationProps> = observer(({
  store,
  onNext,
  onBack,
  renderStep = undefined,
  renderConnector = undefined,
  renderNextButton = undefined,
  renderBackButton = undefined
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
