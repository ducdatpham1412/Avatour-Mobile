import {BORDER_RADIUS, FONT_SIZE} from 'asset';
import {
  ErrorIcon,
  NotificationIcon,
  QuestionIcon,
  SuccessIcon,
} from 'asset/icons';
import {StyleButton, StyleText} from 'components/base';
import {ScaleView} from 'components/common';
import {useTheme} from 'hook';
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
  Modal,
  StyleProp,
  TextStyle,
  Vibration,
  View,
  ViewStyle,
} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import {I18Normalize} from 'utility/I18Next';
import {impactLight, impactMedium} from 'utility/haptic';
import {moderateScale, scale, verticalScale} from 'utility/scale';

const modalRef = createRef<ElementRef<typeof ModalAlert>>();

type TypeShowParams = {
  title?: I18Normalize;
  i18Content?: I18Normalize;
  content?: any;
  onClose?: () => void;
};

type TypeShowOptions = TypeShowParams & {
  onCancel?: () => void;
  onContinue: () => void;
};

type TypeShow = {
  notification: (value?: TypeShowParams) => void;
  success: (value?: TypeShowParams) => void;
  error: (value?: TypeShowParams) => void;
  options: (value?: TypeShowOptions) => void;
  hide: () => void;
};

type TypeStatus = 'notification' | 'success' | 'error' | 'options';

/**
 * This promise to await the last show finished, then the next can show;
 */
let promiseForNextShow: Promise<any>;
let resolveForNextShow: any;

const ModalAlert = forwardRef((_: any, ref: ForwardedRef<TypeShow>) => {
  const theme = useTheme();
  const scaleRef = useRef<ElementRef<typeof ScaleView>>(null);
  const onContinueFunction = useRef<() => void>();
  const onCancelFunction = useRef<() => void>();
  const onCloseFunction = useRef<() => void>();

  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<TypeStatus>();
  const [title, setTitle] = useState<I18Normalize>('common.null');
  const [content, setContent] = useState<I18Normalize>('common.null');

  let tintColor = theme.white;
  if (status === 'notification') {
    tintColor = theme.p_700;
  } else if (status === 'success') {
    tintColor = theme.p_600;
  } else if (status === 'error') {
    tintColor = theme.red;
  } else if (status === 'options') {
    tintColor = theme.p_800;
  }

  useImperativeHandle(
    ref ?? modalRef,
    () => ({
      notification: async value => {
        await promiseForNextShow;
        impactLight();
        setStatus('notification');
        setTitle(value?.title ?? 'common.alert');
        setContent(
          value?.i18Content ??
            (value?.content as I18Normalize) ??
            'common.null',
        );
        onCloseFunction.current = value?.onClose;
        setVisible(true);
      },
      success: async value => {
        await promiseForNextShow;
        impactMedium();
        setStatus('success');
        setTitle(value?.title ?? 'common.success');
        setContent(
          value?.i18Content ??
            (value?.content as I18Normalize) ??
            'common.null',
        );
        onCloseFunction.current = value?.onClose;
        setVisible(true);
      },
      error: async value => {
        await promiseForNextShow;
        Vibration.vibrate();
        setStatus('error');
        setTitle(value?.title ?? 'common.error');
        setContent(
          value?.i18Content ??
            (value?.content as I18Normalize) ??
            'common.null',
        );
        onCloseFunction.current = value?.onClose;
        setVisible(true);
      },
      options: async value => {
        await promiseForNextShow;
        impactMedium();
        setStatus('options');
        setTitle(value?.title ?? 'common.alert');
        setContent(
          value?.i18Content ??
            (value?.content as I18Normalize) ??
            'common.null',
        );
        onCloseFunction.current = value?.onClose;
        onContinueFunction.current = value?.onContinue;
        onCancelFunction.current = value?.onCancel;
        setVisible(true);
      },
      hide: () => {
        promiseForNextShow = new Promise(resolve => {
          resolveForNextShow = resolve;
        });
        setVisible(false);
      },
    }),
    [],
  );

  const renderIcon = () => {
    if (status === 'success') {
      return <SuccessIcon style={$icon} tintColor={tintColor} />;
    }
    if (status === 'error') {
      return <ErrorIcon style={$icon} tintColor={tintColor} />;
    }
    if (status === 'notification') {
      return <NotificationIcon style={$icon} tintColor={tintColor} />;
    }
    if (status === 'options') {
      return <QuestionIcon style={$icon} tintColor={tintColor} />;
    }
    return null;
  };

  const renderButton = () => {
    if (status === 'success' || status === 'error') {
      return (
        <StyleButton
          title="common.ok"
          containerStyle={[$button, {backgroundColor: tintColor}]}
          onPress={() => {
            onCloseFunction.current?.();
            modalRef.current?.hide();
          }}
        />
      );
    }

    if (status === 'options') {
      return (
        <View style={$buttonOption}>
          <StyleButton
            title="common.cancel"
            containerStyle={[$buttonCancel, {borderColor: theme.black}]}
            titleStyle={{color: theme.black}}
            onPress={() => {
              onCloseFunction.current?.();
              onCancelFunction.current?.();
              modalRef.current?.hide();
            }}
          />
          <View style={{width: scale(10)}} />
          <StyleButton
            title="common.continue"
            containerStyle={[$buttonContinue, {backgroundColor: tintColor}]}
            onPress={() => {
              onCloseFunction.current?.();
              onContinueFunction?.current?.();
              modalRef.current?.hide();
            }}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <Modal
      visible={visible}
      onDismiss={() => {
        setVisible(false);
        onCloseFunction.current = undefined;
        onContinueFunction.current = undefined;
        onCancelFunction.current = undefined;
        setStatus(undefined);
        setTitle('common.null');
        setContent('common.null');
        resolveForNextShow?.('');
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
        <ScaleView ref={scaleRef} style={[$body, {backgroundColor: tintColor}]}>
          <View style={$upView} />
          <View style={[$bottomView, {backgroundColor: theme.white}]}>
            <Svg
              width="212"
              height="54"
              viewBox="0 0 212 54"
              fill="none"
              style={{top: -9}}>
              <Path
                d="M157.08 24.1584C143.922 37.2297 131.821 54 106.743 54H105.257C80.1794 54 68.0776 37.2297 54.9195 24.1584C38.5419 8.80435 16.3795 9.48749 0 9.01262V0H212V9.01262C195.621 9.48749 174.68 5.86957 157.08 24.1584Z"
                fill={tintColor}
              />
            </Svg>

            <StyleText i18Text={title} customStyle={$title} />
            <StyleText i18Text={content} customStyle={$content} />

            {renderButton()}
          </View>

          {renderIcon()}
        </ScaleView>
      </View>
    </Modal>
  );
});

const $container: ViewStyle = {
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};
const $body: ViewStyle = {
  width: '83%',
  borderRadius: BORDER_RADIUS.f2,
  alignItems: 'center',
  overflow: 'hidden',
};
const $upView: TextStyle = {
  width: '100%',
  height: moderateScale(70),
  alignItems: 'center',
  paddingTop: verticalScale(20),
};
const $icon: ViewStyle = {
  position: 'absolute',
  top: moderateScale(23),
};
const $bottomView: ViewStyle = {
  width: '100%',
  backgroundColor: 'lightgreen',
  alignItems: 'center',
  paddingHorizontal: scale(12),
};
const $title: TextStyle = {
  fontWeight: 'bold',
  marginTop: verticalScale(5),
  textAlign: 'center',
  fontSize: FONT_SIZE.f1,
};
const $content: TextStyle = {
  textAlign: 'center',
  marginTop: verticalScale(5),
};
const $button: ViewStyle = {
  marginTop: verticalScale(20),
  marginBottom: verticalScale(20),
};
const $buttonOption: StyleProp<ViewStyle> = [
  $button,
  {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
  },
];
const $buttonCancel: ViewStyle = {
  flex: 1,
  backgroundColor: 'transparent',
  borderWidth: moderateScale(1),
};
const $buttonContinue: ViewStyle = {
  flex: 1,
};

export default Object.assign(ModalAlert, {
  notification: (value?: TypeShowParams) =>
    modalRef.current?.notification(value),
  success: (value?: TypeShowParams) => modalRef.current?.success(value),
  error: (value?: TypeShowParams) => modalRef.current?.error(value),
  options: (value?: TypeShowOptions) => modalRef.current?.options(value),
  hide: () => modalRef.current?.hide(),
});
