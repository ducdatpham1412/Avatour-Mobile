import React, {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {Animated, StyleProp, ViewStyle} from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

type TypeShow = {
  zoomIn: () => void;
  zoomOut: () => void;
};

const ScaleView = ({style, children}: Props, ref: ForwardedRef<TypeShow>) => {
  const scale = useRef(new Animated.Value(0)).current;

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => {
        Animated.spring(scale, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
      zoomOut: () => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      },
    }),
    [],
  );

  return (
    <Animated.View style={[style, {transform: [{scale: scale}]}]}>
      {children}
    </Animated.View>
  );
};

export default forwardRef(ScaleView);
