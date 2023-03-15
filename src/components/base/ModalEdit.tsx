import {BORDER_RADIUS} from 'asset';
import ButtonX from 'components/common/ButtonX';
import {useTheme} from 'hook';
import React, {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState,
} from 'react';
import {Modal, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {scale, verticalScale} from 'utility/scale';
import StyleButton from './StyleButton';
import StyleText from './StyleText';

interface Props {
  children?: ReactNode;
  title?: I18Normalize;
  onSave?: () => void;
  onPressClose?: () => void;
}

const ModalEdit = (
  {children, title, onSave, onPressClose}: Props,
  ref: ForwardedRef<TypeShowModalize>,
) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }),
    [],
  );

  return (
    <Modal
      visible={visible}
      onDismiss={() => setVisible(false)}
      transparent
      animationType="slide">
      <View style={[$container, {backgroundColor: theme.black_opacity(0.2)}]}>
        <View style={[$body, {backgroundColor: theme.white}]}>
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
              setVisible(false);
              onSave?.();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const $container: ViewStyle = {
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};
const $body: ViewStyle = {
  width: '90%',
  paddingTop: verticalScale(4),
  paddingBottom: verticalScale(12),
  borderRadius: BORDER_RADIUS.f3,
  alignItems: 'center',
  paddingHorizontal: scale(16),
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
