import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface UsePageAnimationProps {
  isVisible: boolean;
  fadeDuration?: number;
  slideDuration?: number;
  slideDistance?: number;
}

export function usePageAnimation({
  isVisible,
  fadeDuration = 600,
  slideDuration = 400,
  slideDistance = 30,
}: UsePageAnimationProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(slideDistance)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: fadeDuration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: slideDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 화면에서 벗어날 때 애니메이션 리셋
      fadeAnim.setValue(0);
      slideAnim.setValue(slideDistance);
    }
  }, [isVisible, fadeAnim, slideAnim, fadeDuration, slideDuration, slideDistance]);

  return {
    fadeAnim,
    slideAnim,
  };
} 