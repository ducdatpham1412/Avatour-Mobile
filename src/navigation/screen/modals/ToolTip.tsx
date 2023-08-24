import {BORDER_RADIUS, FONT_SIZE} from 'asset';
import {Metrics} from 'asset/metrics';
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
import {TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {$styleDropShadow} from 'utility/assistant';
import {impactLight} from 'utility/haptic';
import {moderateScale, scale, verticalScale} from 'utility/scale';

type TypeShow = {
  content: string;
  button?: {
    title: I18Normalize;
    //
    onPress: () => Promise<'success' | 'error'> | void;
  };
};

const modalRef = createRef<ElementRef<typeof ToolTip>>();

const ToolTip = forwardRef(
  (_: any, ref: ForwardedRef<TypeShowModalize<TypeShow>>) => {
    const theme = useTheme();

    const scaleRef = useRef<ElementRef<typeof ScaleView>>(null);
    const content = useRef<string>();
    const button = useRef<TypeShow['button']>();

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const onHide = () => {
      if (!loading) {
        setVisible(false);
        content.current = undefined;
        button.current = undefined;
      }
    };

    const onPress = async () => {
      setLoading(true);
      const res = await button.current?.onPress?.();
      if (res === 'error') {
        setLoading(false);
        return;
      }

      setLoading(false);
      onHide();
    };

    useImperativeHandle(
      ref ?? modalRef,
      () => ({
        show: value => {
          impactLight();
          content.current = value?.content;
          button.current = value?.button;
          setVisible(true);
        },
        hide: () => onHide(),
      }),
      [loading],
    );

    if (!visible) {
      return null;
    }

    return (
      <View style={$container} onLayout={() => scaleRef.current?.zoomOut()}>
        <View style={$layOut} onTouchStart={onHide} />
        <ScaleView
          ref={scaleRef}
          style={[
            $body,
            $styleDropShadow,
            {backgroundColor: theme.p_700, shadowColor: theme.black},
          ]}>
          <StyleText
            originValue={content.current}
            mode="html"
            customStyle={[$content, {color: theme.white}]}
          />
          {!!button.current && (
            <StyleButton
              title={button.current?.title}
              containerStyle={[$button, {backgroundColor: theme.white}]}
              titleStyle={[$textButton, {color: theme.black}]}
              onPress={onPress}
              isLoading={loading}
            />
          )}
        </ScaleView>
      </View>
    );
  },
);

const width = scale(230);
const $container: ViewStyle = {
  position: 'absolute',
  width: Metrics.width,
  height: Metrics.height,
  padding: scale(12),
  borderRadius: BORDER_RADIUS.f2,
  alignItems: 'center',
  justifyContent: 'center',
};
const $layOut: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
};
const $body: ViewStyle = {
  width,
  borderRadius: BORDER_RADIUS.f2,
  shadowOpacity: 0.3,
  padding: scale(12),
};
const $content: TextStyle = {
  fontSize: FONT_SIZE.f3,
};
const $button: ViewStyle = {
  width: '100%',
  height: moderateScale(30),
  marginTop: verticalScale(12),
};
const $textButton: TextStyle = {
  fontSize: FONT_SIZE.f3,
};

export default Object.assign(ToolTip, {
  show: (value: TypeShow) => modalRef.current?.show(value),
  hide: () => modalRef.current?.hide(),
});
