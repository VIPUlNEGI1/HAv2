import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale } from '@/Helpers/Responsive';

export interface FormStepperStep {
  key: string;
  title: string;
  subtitle?: string;
}

interface FormStepperProps {
  steps: FormStepperStep[];
  currentStep: number;
  onStepPress?: (index: number) => void;
  allowStepNavigation?: boolean;
}

const STEP_CONFIG = {
  damping: 18,
  stiffness: 120,
};

export function FormStepper({
  steps,
  currentStep,
  onStepPress,
  allowStepNavigation = false,
}: FormStepperProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(0);
  const prevStep = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(currentStep, STEP_CONFIG);
    prevStep.value = currentStep;
  }, [currentStep]);

  return (
    <View style={styles.wrapper}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <View key={step.key} style={styles.stepRow}>
            {/* Connector line (before first step is hidden) */}
            {index > 0 && (
              <View style={styles.connectorWrapper}>
                <Animated.View
                  style={[
                    styles.connectorBg,
                    { backgroundColor: theme.border },
                  ]}
                />
                <AnimatedConnectorLine
                  theme={theme}
                  progress={progress}
                  stepIndex={index}
                />
              </View>
            )}

            <AnimatedStepNode
              theme={theme}
              index={index}
              progress={progress}
              isCompleted={isCompleted}
              isActive={isActive}
              isPending={isPending}
              onPress={
                allowStepNavigation && onStepPress
                  ? () => onStepPress(index)
                  : undefined
              }
            />

            {/* Step label */}
            <View style={styles.labelWrap}>
              <Text
                style={[
                  styles.stepTitle,
                  {
                    color: isActive
                      ? theme.primary
                      : isCompleted
                        ? theme.text
                        : theme.textSecondary,
                    fontWeight: isActive ? '800' : '600',
                  },
                ]}
                numberOfLines={1}
              >
                {step.title}
              </Text>
              {step.subtitle ? (
                <Text
                  style={[styles.stepSubtitle, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  {step.subtitle}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function AnimatedConnectorLine({
  theme,
  progress,
  stepIndex,
}: {
  theme: any;
  progress: Animated.SharedValue<number>;
  stepIndex: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const fill = Math.min(1, Math.max(0, progress.value - (stepIndex - 1)));
    return {
      width: (fill * 100).toString() + '%',
    };
  });

  return (
    <View style={styles.connectorFillWrap}>
      <Animated.View
        style={[
          styles.connectorFill,
          { backgroundColor: theme.primary },
          animatedStyle,
        ]}
      />
    </View>
  );
}

function AnimatedStepNode({
  theme,
  index,
  progress,
  isCompleted,
  isActive,
  isPending,
  onPress,
}: {
  theme: any;
  index: number;
  progress: Animated.SharedValue<number>;
  isCompleted: boolean;
  isActive: boolean;
  isPending: boolean;
  onPress?: () => void;
}) {
  const scale = useSharedValue(1);
  const ringScale = useSharedValue(isActive ? 1 : 0.8);
  const checkOpacity = useSharedValue(isCompleted ? 1 : 0);

  useEffect(() => {
    ringScale.value = withSpring(isActive ? 1 : 0.85, STEP_CONFIG);
    checkOpacity.value = withTiming(isCompleted ? 1 : 0, { duration: 200 });
  }, [isActive, isCompleted]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    borderColor: theme.primary,
    borderWidth: 2,
    backgroundColor: theme.surface,
  }));

  const innerStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
  }));

  const nodeStyle = [
          styles.node,
          {
            backgroundColor: isCompleted
              ? theme.primary
              : isActive
                ? theme.surface
                : theme.background,
            borderWidth: isActive ? 2 : 0,
            borderColor: theme.primary,
          },
        ];

  const NodeWrapper = onPress ? TouchableOpacity : View;

  return (
    <View style={styles.nodeWrap}>
      {isActive && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              borderColor: theme.primary,
              backgroundColor: theme.primary + '15',
            },
            ringStyle,
          ]}
        />
      )}
      <NodeWrapper
        {...(onPress && { onPress, activeOpacity: 0.7 })}
        style={nodeStyle}
      >
        {isCompleted ? (
          <Animated.View style={innerStyle}>
            <Check size={moderateScale(16)} color="#fff" strokeWidth={3} />
          </Animated.View>
        ) : isActive ? (
          <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />
        ) : (
          <Text style={[styles.pendingNumber, { color: theme.textSecondary }]}>
            {index + 1}
          </Text>
        )}
      </NodeWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(4),
  },
  stepRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  connectorWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: moderateScale(20),
    height: 3,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 0,
  },
  connectorBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
    opacity: 0.4,
  },
  connectorFillWrap: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  connectorFill: {
    height: 3,
    borderRadius: 2,
  },
  nodeWrap: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  pulseRing: {
    position: 'absolute',
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
  },
  node: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
  },
  pendingNumber: {
    fontSize: moderateScale(13),
    fontWeight: '800',
  },
  labelWrap: {
    marginTop: moderateScale(8),
    paddingHorizontal: moderateScale(4),
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: moderateScale(11),
  },
  stepSubtitle: {
    fontSize: moderateScale(10),
    marginTop: 2,
  },
});
