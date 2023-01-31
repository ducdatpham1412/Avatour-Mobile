import {useRef} from 'react';
import {
    Animated,
    GestureResponderEvent,
    PanResponderGestureState,
} from 'react-native';

export function useAnimatedValue(initialValue: number) {
    const lazyRef = useRef<Animated.Value>();
    if (lazyRef.current === undefined) {
        lazyRef.current = new Animated.Value(initialValue);
    }
    return lazyRef.current as Animated.Value;
}

export const isMovingHorizontally = (
    _: GestureResponderEvent,
    gestureState: PanResponderGestureState,
) => {
    return (
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2) &&
        Math.abs(gestureState.vx) > Math.abs(gestureState.vy * 2)
    );
};

export const DEAD_ZONE = 12;
export const DefaultTransitionSpec = {
    timing: Animated.spring,
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
};
export const swipeVelocityThreshold = 0.15;
