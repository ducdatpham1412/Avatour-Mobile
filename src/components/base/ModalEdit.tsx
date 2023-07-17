import {BORDER_RADIUS} from 'asset';
import ButtonX from 'components/common/ButtonX';
import {useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Modal, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {scale, verticalScale} from 'utility/scale';
import StyleButton from './StyleButton';
import StyleText from './StyleText';
import {ScaleView} from 'components/common';
import {impactLight} from 'utility/haptic';

interface Props {
  children?: ReactNode;
  title?: I18Normalize;
  onSave?: () => void;
  onPressClose?: () => void;
  loading?: boolean;
  disable?: boolean;
  onDismiss?: () => void;
}

const ModalEdit = (
  {
    children,
    title,
    onSave,
    onPressClose,
    loading = false,
    disable = false,
    onDismiss,
  }: Props,
  ref: ForwardedRef<TypeShowModalize>,
) => {
  const theme = useTheme();
  const scaleRef = useRef<ElementRef<typeof ScaleView>>(null);
  const [visible, setVisible] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        impactLight();
        setVisible(true);
      },
      hide: () => setVisible(false),
    }),
    [],
  );

  return (
    <Modal
      visible={visible}
      onDismiss={() => {
        setVisible(false);
        onDismiss?.();
      }}
      transparent
      animationType="fade">
      <View
        style={[
          $container,
          {
            backgroundColor: theme.black_opacity(0.4),
          },
        ]}
        onLayout={() => scaleRef.current?.zoomOut()}>
        <ScaleView
          ref={scaleRef}
          style={[$body, {backgroundColor: theme.white}]}>
          <ButtonX
            onPress={() => {
              setVisible(false);
              onPressClose?.();
            }}
          />
          <StyleText i18Text={title || 'common.null'} customStyle={$title} />
          {children}
          <StyleButton
            containerStyle={$buttonConfirm}
            title="common.save"
            onPress={() => {
              onSave?.();
            }}
            isLoading={loading}
            disable={disable}
          />
        </ScaleView>
      </View>
    </Modal>
  );
};

const $container: ViewStyle = {
  width: '100%',
  height: '100%',
  alignItems: 'center',
};
const $body: ViewStyle = {
  width: '90%',
  paddingTop: verticalScale(4),
  paddingBottom: verticalScale(12),
  borderRadius: BORDER_RADIUS.f3,
  alignItems: 'center',
  paddingHorizontal: scale(16),
  marginTop: verticalScale(200),
};
const $title: TextStyle = {
  fontWeight: 'bold',
  marginBottom: verticalScale(8),
};
const $buttonConfirm: ViewStyle = {
  marginTop: verticalScale(20),
  width: scale(150),
};

export default forwardRef(ModalEdit);
