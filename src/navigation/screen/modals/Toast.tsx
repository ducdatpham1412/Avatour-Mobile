import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {Metrics} from 'asset/metrics';
import {StyleText} from 'components/base';
import {useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  createRef,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale} from 'utility/scale';

interface ItemToastProp {
  content?: I18Normalize;
  onFinished: () => void;
}

interface State {
  time: number;
  text: I18Normalize;
}

const modalToastRef = createRef<ElementRef<typeof Toast>>();

const ItemToast = memo(
  ({content, onFinished}: ItemToastProp) => {
    const theme = useTheme();
    const opacity = useSharedValue(1);
    const opacityStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));
    const timeOut = useRef<number>(0);

    useEffect(() => {
      timeOut.current = setTimeout(() => {
        opacity.value = withTiming(0, {duration: 1000}, finished => {
          if (finished) {
            runOnJS(onFinished)();
          }
        });
      }, 500);
      return () => clearTimeout(timeOut.current);
    }, []);

    return (
      <Animated.View
        style={[
          $container,
          {backgroundColor: theme.black_opacity(0.6)},
          opacityStyle,
        ]}>
        <Entypo name="check" style={[$icon, {color: theme.white}]} />
        {!!content && (
          <StyleText
            i18Text={content}
            customStyle={[$content, {color: theme.white}]}
          />
        )}
      </Animated.View>
    );
  },
  () => true,
);

const Toast = forwardRef(
  (_: any, ref: ForwardedRef<TypeShowModalize<I18Normalize>>) => {
    const [listItemToasts, setListItemToasts] = useState<State[]>([]);

    useImperativeHandle(
      ref ?? modalToastRef,
      () => ({
        show: text => {
          setListItemToasts(pre =>
            pre.concat({
              time: Date.now(),
              text: text ?? 'common.null',
            }),
          );
        },
        hide: () => {},
      }),
      [],
    );

    return (
      <>
        {listItemToasts.map(item => (
          <ItemToast
            key={item.time}
            content={item.text}
            onFinished={() => {
              setListItemToasts(pre => {
                return pre.filter(toast => toast.time !== item.time);
              });
            }}
          />
        ))}
      </>
    );
  },
);

const {width, height} = Metrics;
const $container: ViewStyle = {
  position: 'absolute',
  width: moderateScale(100),
  height: moderateScale(100),
  left: width / 2 - moderateScale(50),
  top: height / 2 - moderateScale(50),
  borderRadius: BORDER_RADIUS.f3,
  opacity: 0.8,
  alignItems: 'center',
  justifyContent: 'center',
};
const $icon: TextStyle = {
  fontSize: moderateScale(60),
};
const $content: TextStyle = {
  fontSize: FONT_SIZE.f4,
  fontWeight: FONT_WEIGHT_MEDIUM,
};

export default Object.assign(Toast, {
  show: (value?: I18Normalize) => modalToastRef.current?.show(value),
  hide: () => modalToastRef.current?.hide(),
});
