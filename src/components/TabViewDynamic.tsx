import React, {
  Children,
  ForwardedRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  Animated,
  GestureResponderEvent,
  I18nManager,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';
import {
  DEAD_ZONE,
  DefaultTransitionSpec,
  isMovingHorizontally,
  swipeDistanceThreshold,
  swipeVelocityThreshold,
  useAnimatedValue,
} from 'utility/animation';

interface Props {
  width: number;
  children: ReactNode;
  onScroll?: (translateX: number) => void;
}

interface Refs {
  navigateToIndex: (index: number) => void;
}

const TabViewDynamic = (
  {width, children, onScroll}: Props,
  ref: ForwardedRef<Refs>,
) => {
  const numberTabs = Children.toArray(children).length;
  const layOutWidth = width * numberTabs;
  const maxTranslate = layOutWidth * (numberTabs - 1);
  const currentIndex = useRef(0);

  const panX = useAnimatedValue(0);
  const translateX = Animated.multiply(
    panX.interpolate({
      inputRange: [-maxTranslate, 0],
      outputRange: [-maxTranslate, 0],
      extrapolate: 'clamp',
    }),
    I18nManager.isRTL ? -1 : 1,
  );
  if (onScroll) {
    translateX.addListener(({value}) => onScroll(value));
  }

  const navigateToIndex = (index: number) => {
    const offset = -index * width;
    const {timing, ...transitionConfig} = DefaultTransitionSpec;
    Animated.parallel([
      timing(panX, {
        ...transitionConfig,
        toValue: offset,
        useNativeDriver: false,
      }),
    ]).start(() => {
      currentIndex.current = index;
    });
  };

  const canMoveScreen = (
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;
    const isMovingHorizon = isMovingHorizontally(event, gestureState);
    const check =
      isMovingHorizon &&
      ((diffX >= DEAD_ZONE && currentIndex.current > 0) ||
        (diffX <= -DEAD_ZONE && currentIndex.current < numberTabs - 1));
    return check;
  };

  const startGesture = () => {
    panX.stopAnimation();
    const temp: any = panX;
    panX.setOffset(temp._value);
  };

  const respondToGesture = (
    _: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;

    if (
      (diffX > 0 && currentIndex.current <= 0) ||
      (diffX < 0 && currentIndex.current >= numberTabs - 1)
    ) {
      return;
    }
    panX.setValue(diffX);
  };

  const finishGesture = (
    _: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    panX.flattenOffset();

    const current = currentIndex.current;
    let nextIndex = currentIndex.current;

    if (
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
      Math.abs(gestureState.vx) > Math.abs(gestureState.vy) &&
      (Math.abs(gestureState.dx) > swipeDistanceThreshold ||
        Math.abs(gestureState.vx) > swipeVelocityThreshold)
    ) {
      nextIndex = Math.round(
        Math.min(
          Math.max(
            0,
            I18nManager.isRTL
              ? current + gestureState.dx / Math.abs(gestureState.dx)
              : current - gestureState.dx / Math.abs(gestureState.dx),
          ),
          numberTabs - 1,
        ),
      );

      currentIndex.current = nextIndex;
    }

    if (!Number.isFinite(nextIndex)) {
      nextIndex = current;
    }

    navigateToIndex(nextIndex);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: canMoveScreen,
    onMoveShouldSetPanResponderCapture: canMoveScreen,
    onPanResponderGrant: startGesture,
    onPanResponderMove: respondToGesture,
    onPanResponderTerminate: finishGesture,
    onPanResponderRelease: finishGesture,
    onPanResponderTerminationRequest: () => true,
  });

  useImperativeHandle(
    ref,
    () => ({
      navigateToIndex,
    }),
    [],
  );

  return (
    <Animated.View
      style={{
        width: layOutWidth,
        flexDirection: 'row',
        transform: [{translateX}],
      }}
      {...panResponder.panHandlers}>
      {children}
    </Animated.View>
  );
};

export default forwardRef(TabViewDynamic);
