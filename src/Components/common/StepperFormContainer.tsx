import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { FormStepper, type FormStepperStep } from './FormStepper';
import { moderateScale } from '@/Helpers/Responsive';

export interface StepperFormStep extends FormStepperStep {
  content: React.ReactNode;
}

interface StepperFormContainerProps {
  steps: StepperFormStep[];
  currentStep: number;
  onStepPress?: (index: number) => void;
  allowStepNavigation?: boolean;
  /** Direction of step transition: 'horizontal' (slide) or 'vertical' (fade down) */
  transitionDirection?: 'horizontal' | 'vertical';
}

export function StepperFormContainer({
  steps,
  currentStep,
  onStepPress,
  allowStepNavigation = false,
  transitionDirection = 'vertical',
}: StepperFormContainerProps) {
  const step = steps[currentStep];
  if (!step) return null;

  const entering = transitionDirection === 'horizontal'
    ? FadeInRight.duration(280).springify()
    : FadeInDown.duration(260).springify();

  return (
    <View style={styles.container}>
      <FormStepper
        steps={steps}
        currentStep={currentStep}
        onStepPress={onStepPress}
        allowStepNavigation={allowStepNavigation}
      />
      <Animated.View
        key={step.key}
        entering={entering}
        style={styles.content}
      >
        {step.content}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: moderateScale(8),
  },
});
