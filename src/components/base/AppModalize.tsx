import {FONT_SIZE} from 'asset';
import {useTheme} from 'hook';
import React, {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import StyleText from './StyleText';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
  modalHeight?: number;
  panGestureEnabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
  title?: I18Normalize;
  titleParams?: Record<string, any>;
  adjustToContentHeight?: boolean;
};

const AppModalize = forwardRef(
  (
    {
      containerStyle,
      children,
      modalHeight,
      panGestureEnabled = true,
      onOpen,
      onClose,
      onClosed,
      title,
      titleParams,
      adjustToContentHeight = true,
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
        adjustToContentHeight={adjustToContentHeight}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
          nestedScrollEnabled: true,
          scrollEnabled: false,
        }}
        handlePosition="inside"
        modalStyle={$modalStyle}
        overlayStyle={{backgroundColor: theme.black_opacity(0.3)}}
        closeOnOverlayTap={panGestureEnabled}
        panGestureEnabled={panGestureEnabled}
        onOpen={onOpen}
        onClosed={onClosed}
        onClose={onClose}
        modalHeight={adjustToContentHeight ? undefined : modalHeight}>
        <View
          style={[
            $container,
            {
              backgroundColor: theme.white,
              height: modalHeight,
            },
            containerStyle,
          ]}>
          {!!title && (
            <StyleText
              i18Text={title}
              i18Params={titleParams}
              customStyle={$title}
              numberOfLines={1}
            />
          )}
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
const $title: TextStyle = {
  fontSize: FONT_SIZE.f1,
  fontWeight: 'bold',
  alignSelf: 'center',
  marginBottom: verticalScale(10),
};

export default AppModalize;
