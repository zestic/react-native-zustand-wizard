import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import type { AnimationConfig } from '../types/animation';

interface DefaultTransitionProps {
  children: React.ReactNode;
  animationConfig?: AnimationConfig;
  direction: 'forward' | 'backward';
}

export const DefaultTransition: React.FC<DefaultTransitionProps> = ({
  children,
  animationConfig,
  direction,
}) => {
  const animation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: animationConfig?.duration ?? 300,
      useNativeDriver: true,
    }).start();
    
    return () => {
      animation.setValue(0);
    };
  }, [children]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [direction === 'forward' ? 100 : -100, 0],
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateX }],
        opacity: animation,
        ...animationConfig?.entering,
      }}
    >
      {children}
    </Animated.View>
  );
};
