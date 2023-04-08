import {safePaddingNotZero} from 'asset/metrics';
import {useTheme} from 'hook';
import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  RefObject,
  useImperativeHandle,
  useRef,
} from 'react';
import {View, ViewStyle} from 'react-native';
import {Modalize, ModalizeProps} from 'react-native-modalize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale, scale, verticalScale} from 'utility/scale';

const AppModalize = forwardRef(
  (props: ModalizeProps, ref: ForwardedRef<TypeShowModalize>) => {
    const theme = useTheme();
    const {bottom} = useSafeAreaInsets();
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
        {...props}
        modalStyle={$modalStyle}
        overlayStyle={{backgroundColor: theme.black_opacity(0.3)}}>
        <View
          style={[
            $container,
            {
              backgroundColor: theme.white,
              paddingBottom: bottom || safePaddingNotZero,
            },
          ]}>
          {props?.children}
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
  paddingHorizontal: scale(16),
  overflow: 'hidden',
};

export default AppModalize;
