import {
  View,
  Text,
  Modal,
  ViewStyle,
  StyleSheet,
  ImageStyle,
  TextStyle,
} from 'react-native';
import React, {
  ElementRef,
  ForwardedRef,
  createRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {useTheme} from 'hook';
import {StyleIcon, StyleImage, StyleText} from 'components/base';
import {RNCamera, BarCodeReadEvent} from 'react-native-camera';
import Images from 'asset/img/images';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ButtonX} from 'components/common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const modalRef = createRef<ElementRef<typeof ModalScanQr>>();

const ModalScanQr = forwardRef(
  (_: any, ref: ForwardedRef<TypeShowModalize>) => {
    const theme = useTheme();
    const {top} = useSafeAreaInsets();

    const [showCamera, setShowCamera] = useState(false);
    const [showOpenSetting, setShowOpenSetting] = useState(false);
    const [visible, setVisible] = useState(false);

    useImperativeHandle(
      ref ?? modalRef,
      () => ({
        show: () => {
          setShowCamera(true);
          setVisible(true);
        },
        hide: () => setVisible(false),
      }),
      [],
    );

    const onBarCodeRead = (e: BarCodeReadEvent) => {
      console.log('Bar code: ', e);
    };

    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={[$container, {backgroundColor: theme.background}]}>
          {showCamera && (
            <RNCamera
              style={StyleSheet.absoluteFill}
              captureAudio={false}
              onBarCodeRead={onBarCodeRead}
              onStatusChange={value => {
                if (value.cameraStatus === 'NOT_AUTHORIZED') {
                  setShowOpenSetting(true);
                }
              }}
              notAuthorizedView={<View />}
            />
          )}
          <StyleImage
            source={Images.icons.fingerScan}
            customStyle={$iconFingerScan}
          />

          <ButtonX
            containerStyle={[
              $iconX,
              {
                top: top + verticalScale(5),
                backgroundColor: theme.white_opacity(0.6),
              },
            ]}
            iconStyle={$icon}
            onPress={() => setVisible(false)}
          />
        </View>
      </Modal>
    );
  },
);

const $container: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
};
const $iconFingerScan: ImageStyle = {
  width: scale(250),
  height: scale(250),
};
const $iconX: ViewStyle = {
  position: 'absolute',
  right: scale(12),
};
const $icon: TextStyle = {
  fontSize: moderateScale(17),
};

export default Object.assign(ModalScanQr, {
  show: () => modalRef.current?.show(),
  hide: () => modalRef.current?.hide(),
});
