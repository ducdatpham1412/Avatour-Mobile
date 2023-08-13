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
import {useTranslation} from 'react-i18next';
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

interface TypeShow {
  title?: I18Normalize;
  content?: string;
}

interface ItemToastProp {
  title?: string;
  content?: string;
  onFinished: () => void;
}

interface State {
  time: number;
  title: string;
  content: string;
}

const modalToastRef = createRef<ElementRef<typeof Toast>>();

const ItemToast = memo(
  ({title, content, onFinished}: ItemToastProp) => {
    const theme = useTheme();
    const opacity = useSharedValue(1);
    const opacityStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));
    const timeOut = useRef<NodeJS.Timeout>();

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
        {!!title && (
          <StyleText
            originValue={title}
            customStyle={[$title, {color: theme.white}]}
          />
        )}
        {!!content && (
          <StyleText
            originValue={content}
            customStyle={[$content, {color: theme.white}]}
          />
        )}
      </Animated.View>
    );
  },
  () => true,
);

const Toast = forwardRef(
  (_: any, ref: ForwardedRef<TypeShowModalize<TypeShow>>) => {
    const {t} = useTranslation();
    const [listItemToasts, setListItemToasts] = useState<State[]>([]);

    useImperativeHandle(
      ref ?? modalToastRef,
      () => ({
        show: value => {
          setListItemToasts(pre =>
            pre.concat({
              time: Date.now(),
              title: t(value?.title ?? 'common.null'),
              content: value?.content ?? '',
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
            title={item.title}
            content={item.content}
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
  fontSize: moderateScale(50),
};
const $title: TextStyle = {
  fontSize: FONT_SIZE.f4,
  fontWeight: FONT_WEIGHT_MEDIUM,
  textAlign: 'center',
};
const $content: TextStyle = {
  fontSize: FONT_SIZE.f5,
  textAlign: 'center',
};

export default Object.assign(Toast, {
  show: (value?: TypeShow) => modalToastRef.current?.show(value),
  hide: () => modalToastRef.current?.hide(),
});
