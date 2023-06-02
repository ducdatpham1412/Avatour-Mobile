import React, {
  Children,
  ForwardedRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {Animated, I18nManager} from 'react-native';
import {DefaultTransitionSpec, useAnimatedValue} from 'utility/animation';

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

  useImperativeHandle(
    ref,
    () => ({
      navigateToIndex: index => {
        const offset = -index * width;
        const {timing, ...transitionConfig} = DefaultTransitionSpec;
        Animated.parallel([
          timing(panX, {
            ...transitionConfig,
            toValue: offset,
            useNativeDriver: false,
          }),
        ]).start();
      },
    }),
    [],
  );

  return (
    <Animated.View
      style={{
        width: layOutWidth,
        flexDirection: 'row',
        transform: [{translateX}],
      }}>
      {children}
    </Animated.View>
  );
};

export default forwardRef(TabViewDynamic);
