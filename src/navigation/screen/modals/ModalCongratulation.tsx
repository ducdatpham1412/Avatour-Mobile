import Images from 'asset/img/images';
import LottieView from 'lottie-react-native';
import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

type TypeShow = {
  loop?: boolean;
};

const ModalCongratulation = (
  _: any,
  ref: ForwardedRef<TypeShowModalize<TypeShow>>,
) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        setShow(true);
      },
      hide: () => {
        setShow(false);
      },
    }),
    [],
  );

  if (!show) {
    return null;
  }

  return (
    <View style={$container}>
      <LottieView
        source={Images.images.congratulation}
        style={$lottie}
        autoPlay
        loop={false}
        onAnimationFinish={() => setShow(false)}
      />
    </View>
  );
};

const $container: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  alignItems: 'center',
  justifyContent: 'center',
};
const $lottie: ViewStyle = {
  width: '100%',
  height: '100%',
};

export default forwardRef(ModalCongratulation);
