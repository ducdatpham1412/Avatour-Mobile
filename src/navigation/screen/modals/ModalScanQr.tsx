import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import Images from 'asset/img/images';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {BoxView} from 'components';
import {StyleButton, StyleImage, StyleText} from 'components/base';
import {ButtonX} from 'components/common';
import React, {
  ElementRef,
  ForwardedRef,
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef,
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
import LinearGradient from 'react-native-linear-gradient';
import {openSettings} from 'react-native-permissions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale, scale, verticalScale} from 'utility/scale';

const modalRef = createRef<ElementRef<typeof ModalScanQr>>();

const ModalScanQr = forwardRef(
  (
    _: any,
    ref: ForwardedRef<
      TypeShowModalize<undefined, undefined, Promise<BarCodeReadEvent>>
    >,
  ) => {
    const {top, bottom} = useSafeAreaInsets();

    const promise = useRef<{
      resolve: (value: BarCodeReadEvent) => void;
      reject: () => void;
    }>();

    const [showCamera, setShowCamera] = useState(false);
    const [showOpenSetting, setShowOpenSetting] = useState(false);
    const [visible, setVisible] = useState(false);

    useImperativeHandle(
      ref ?? modalRef,
      () => ({
        show: async () => {
          setShowCamera(true);
          setVisible(true);
          const res = await new Promise<BarCodeReadEvent>((resolve, reject) => {
            promise.current = {
              resolve,
              reject,
            };
          });
          return res;
        },
        hide: () => setVisible(false),
      }),
      [],
    );

    return (
      <Modal visible={visible} animationType="slide" transparent>
        <LinearGradient
          style={[
            $container,
            {
              paddingTop: top || safePaddingNotZero,
              paddingBottom: bottom || safePaddingNotZero,
            },
          ]}
          colors={['#DFA207', '#E7C606', '#F3E992']}>
          <View style={$header}>
            <StyleText
              i18Text="discovery.scanQrAtShop"
              customStyle={$textHeader}
            />
            <ButtonX
              containerStyle={$iconX}
              size={17}
              onPress={() => {
                setVisible(false);
                promise.current?.reject();
              }}
            />
          </View>

          <View style={$qrView}>
            <View style={$qrBox}>
              {showCamera && (
                <RNCamera
                  style={[StyleSheet.absoluteFill, {borderRadius: 100}]}
                  captureAudio={false}
                  onBarCodeRead={e => {
                    promise.current?.resolve(e);
                  }}
                  onStatusChange={value => {
                    if (value.cameraStatus === 'NOT_AUTHORIZED') {
                      setShowOpenSetting(true);
                    }
                  }}
                  notAuthorizedView={<View />}
                />
              )}
            </View>
          </View>

          <StyleText
            i18Text="profile.scanWhenGoToShop"
            customStyle={$textUnder}
          />

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
        </LinearGradient>
      </Modal>
    );
  },
);

const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: horizontalPadding,
  justifyContent: 'center',
};
const $header: ViewStyle = {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  height: moderateScale(40),
};
const $qrView: ViewStyle = {
  flex: 1,
  paddingVertical: verticalScale(12),
};
const $qrBox: ViewStyle = {
  flex: 1,
  borderRadius: BORDER_RADIUS.f2,
  overflow: 'hidden',
};
const $iconFingerScan: ImageStyle = {
  width: scale(250),
  height: scale(250),
  position: 'absolute',
  alignSelf: 'center',
};
const $openSetting: ViewStyle = {
  width: '80%',
  position: 'absolute',
  alignSelf: 'center',
};
const $textCamera: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  textAlign: 'center',
  marginBottom: verticalScale(12),
  fontSize: FONT_SIZE.f3,
};
const $textHeader: TextStyle = {
  fontSize: FONT_SIZE.f1,
  fontWeight: 'bold',
  color: Theme.newTheme.white,
};
const $iconX: ViewStyle = {
  right: 0,
  top: undefined,
};
const $textUnder: TextStyle = {
  color: Theme.newTheme.black,
  fontWeight: FONT_WEIGHT_MEDIUM,
  textAlign: 'center',
  fontSize: FONT_SIZE.f3,
};

export default Object.assign(ModalScanQr, {
  show: async () => await modalRef.current?.show(),
  hide: () => modalRef.current?.hide(),
});
