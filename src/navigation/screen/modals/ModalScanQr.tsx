import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import Images from 'asset/img/images';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {BoxView, LoadingScreen} from 'components';
import {StyleButton, StyleImage, StyleText} from 'components/base';
import {ButtonX} from 'components/common';
import React, {
  ElementRef,
  ForwardedRef,
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  ImageStyle,
  Modal,
  StyleSheet,
  TextStyle,
  Vibration,
  View,
  ViewStyle,
} from 'react-native';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import LinearGradient from 'react-native-linear-gradient';
import {openSettings} from 'react-native-permissions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale, scale, verticalScale} from 'utility/scale';

type TypeShow = TypeShowModalize<
  undefined,
  undefined,
  Promise<BarCodeReadEvent>
> & {
  loading: () => void;
  continue: () => void;
};

interface ErrorViewProps {
  onFinished: () => void;
}

const modalRef = createRef<ElementRef<typeof ModalScanQr>>();

const ErrorView = ({onFinished}: ErrorViewProps) => {
  const scaleRef = useRef(new Animated.Value(1));
  const translateX = useRef(new Animated.Value(0));
  const timeOut = useRef<NodeJS.Timeout>();

  useEffect(() => {
    Animated.timing(scaleRef.current, {
      toValue: 1.5,
      useNativeDriver: true,
      duration: 100,
    }).start(() => {
      Animated.sequence([
        Animated.timing(translateX.current, {
          toValue: 10,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(translateX.current, {
          toValue: -10,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(translateX.current, {
          toValue: 10,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(translateX.current, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.timing(scaleRef.current, {
          toValue: 1,
          useNativeDriver: true,
          duration: 100,
        }).start(() => {
          timeOut.current = setTimeout(() => {
            onFinished();
          }, 1000);
        });
      });
    });

    return () => clearTimeout(timeOut.current);
  }, []);

  return (
    <Animated.View
      style={[
        $error,
        {
          transform: [
            {scale: scaleRef.current},
            {translateX: translateX.current},
          ],
        },
      ]}>
      <StyleText i18Text="alert.invalidQr" customStyle={$textError} />
    </Animated.View>
  );
};

const ModalScanQr = forwardRef((_: any, ref: ForwardedRef<TypeShow>) => {
  const {top, bottom} = useSafeAreaInsets();

  const promise = useRef<{
    resolve: (value: BarCodeReadEvent) => void;
    reject: () => void;
  }>();
  const promiseHide = useRef<{
    resolve: (value: unknown) => void;
  }>();
  const isCheckingData = useRef(false);

  const [showCamera, setShowCamera] = useState(false);
  const [showOpenSetting, setShowOpenSetting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
      hide: async () => {
        setVisible(false);
        await new Promise(resolve => {
          promiseHide.current = {
            resolve,
          };
        });
      },
      loading: () => setLoading(true),
      continue: () => (isCheckingData.current = false),
    }),
    [],
  );

  const onHandleQrData = (e: BarCodeReadEvent) => {
    if (!isCheckingData.current) {
      try {
        isCheckingData.current = true;
        const dataQR: QrData = JSON.parse(String(e.data));
        if (dataQR.app !== 'Avatour') {
          Vibration.vibrate();
          setError(true);
        } else {
          promise.current?.resolve(e);
        }
      } catch (err) {
        Vibration.vibrate();
        setError(true);
      }
    }
  };

  const renderCenter = () => {
    if (showOpenSetting) {
      return (
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
      );
    }

    if (error) {
      return (
        <ErrorView
          onFinished={() => {
            setError(false);
            isCheckingData.current = false;
          }}
        />
      );
    }

    return (
      <StyleImage
        source={Images.icons.fingerScan}
        customStyle={$iconFingerScan}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onDismiss={() => {
        setLoading(false);
        promise.current = undefined;
        promiseHide.current?.resolve('');
        promiseHide.current = undefined;
        isCheckingData.current = false;
      }}>
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
              promise.current?.reject();
              setVisible(false);
            }}
          />
        </View>

        <View style={$qrView}>
          <View style={$qrBox}>
            {showCamera && (
              <RNCamera
                style={[StyleSheet.absoluteFill, {borderRadius: 100}]}
                captureAudio={false}
                onBarCodeRead={onHandleQrData}
                onStatusChange={value => {
                  if (value.cameraStatus === 'NOT_AUTHORIZED') {
                    setShowOpenSetting(true);
                  }
                }}
                notAuthorizedView={<View />}
              />
            )}
            {loading && <LoadingScreen containerStyle={$loading} />}
          </View>
        </View>

        <StyleText
          i18Text="profile.scanWhenGoToShop"
          customStyle={$textUnder}
        />

        {renderCenter()}
      </LinearGradient>
    </Modal>
  );
});

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
const $loading: ViewStyle = {
  backgroundColor: Theme.newTheme.black_opacity(0.8),
};
const $error: ViewStyle = {
  position: 'absolute',
  alignSelf: 'center',
  backgroundColor: Theme.newTheme.white,
  borderRadius: BORDER_RADIUS.f3,
  paddingVertical: verticalScale(8),
  paddingHorizontal: scale(16),
};
const $textError: TextStyle = {
  color: Theme.newTheme.red,
  fontWeight: FONT_WEIGHT_MEDIUM,
};

export default Object.assign(ModalScanQr, {
  show: async () => await modalRef.current?.show(),
  hide: async () => await modalRef.current?.hide(),
  loading: () => modalRef.current?.loading(),
  continue: () => modalRef.current?.continue(),
});
