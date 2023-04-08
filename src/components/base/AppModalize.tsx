import {useTheme} from 'hook';
import React, {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {moderateScale, scale, verticalScale} from 'utility/scale';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
  modalHeight?: number;
  panGestureEnabled?: boolean;
  onOpen?: () => void;
};

const AppModalize = forwardRef(
  (
    {
      containerStyle,
      children,
      modalHeight,
      panGestureEnabled = true,
      onOpen,
    }: Props,
    ref: ForwardedRef<TypeShowModalize>,
  ) => {
    const theme = useTheme();
    const modalRef = useRef<Modalize>(null);

    useImperativeHandle(
      ref,
      () => ({
        show: () => modalRef.current?.open(),
        hide: () => modalRef.current?.close(),
      }),
      [],
    );

    return (
      <Modalize
        ref={modalRef}
        adjustToContentHeight
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
          nestedScrollEnabled: true,
        }}
        handlePosition="inside"
        modalStyle={$modalStyle}
        overlayStyle={{backgroundColor: theme.black_opacity(0.3)}}
        closeOnOverlayTap={panGestureEnabled}
        panGestureEnabled={panGestureEnabled}
        onOpen={onOpen}>
        <View
          style={[
            $container,
            {
              backgroundColor: theme.white,
              height: modalHeight,
            },
            containerStyle,
          ]}>
          {children}
        </View>
      </Modalize>
    );
  },
);

const $modalStyle: ViewStyle = {
  backgroundColor: 'transparent',
};
const $container: ViewStyle = {
  width: '100%',
  borderTopLeftRadius: moderateScale(16),
  borderTopRightRadius: moderateScale(16),
  paddingTop: verticalScale(16),
  paddingHorizontal: scale(12),
  overflow: 'hidden',
};

export default AppModalize;
