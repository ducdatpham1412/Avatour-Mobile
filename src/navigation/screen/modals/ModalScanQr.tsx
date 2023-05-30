import {FONT_WEIGHT_MEDIUM} from 'asset';
import Images from 'asset/img/images';
import {BoxView} from 'components';
import {StyleButton, StyleImage, StyleText} from 'components/base';
import {ButtonX} from 'components/common';
import {useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  createRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {
  ImageStyle,
  Modal,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import {openSettings} from 'react-native-permissions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale, scale, verticalScale} from 'utility/scale';

const modalRef = createRef<ElementRef<typeof ModalScanQr>>();

const onBarCodeRead = (e: BarCodeReadEvent) => {
  console.log('Bar code: ', e);
};

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

          {showOpenSetting ? (
            <BoxView containerStyle={$openSetting}>
              <StyleText
                i18Text="alert.cameraHadBeenDisable"
                customStyle={$textCamera}
              />
              <StyleButton
                title="alert.openSetting"
                onPress={() => openSettings()}
              />
            </BoxView>
          ) : (
            <StyleImage
              source={Images.icons.fingerScan}
              customStyle={$iconFingerScan}
            />
          )}

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
const $openSetting: ViewStyle = {
  width: '80%',
};
const $textCamera: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  textAlign: 'center',
  marginBottom: verticalScale(12),
};

export default Object.assign(ModalScanQr, {
  show: () => modalRef.current?.show(),
  hide: () => modalRef.current?.hide(),
});
