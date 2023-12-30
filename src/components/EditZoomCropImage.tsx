import {StyleImage} from 'components/base';
import {useImageSize} from 'hook';
import React, {useEffect} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  source: ImageSourcePropType;
  width: number;
  height: number;
  onChangeZoomParams?: (value: ZoomImageParams) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

type GestureImageProps = Props & {
  imgSize: {
    width: number;
    height: number;
  };
};

const GestureImage = ({
  source,
  width,
  height,
  onChangeZoomParams,
  containerStyle,
  imgSize,
}: GestureImageProps) => {
  const savedValue = useSharedValue<ZoomImageParams>({
    scale: 1,
    translateX: 0,
    translateY: -(imgSize.height - height) / 2,
  });

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(-(imgSize.height - height) / 2);

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      scale.value = savedValue.value.scale * e.scale;
    })
    .onEnd(() => {
      let targetScale = scale.value;
      let targetX = translateX.value;
      let targetY = translateY.value;
      const scaleWidth = width * scale.value;
      const scaleHeight = imgSize.height * scale.value;

      /**
       * Check for scale
       */
      if (scale.value < 1) {
        targetScale = 1;
      }

      /**
       * Check for translateX and translateY
       */
      const centerPos = {
        translateX: translateX.value + width / 2,
        translateY: translateY.value + imgSize.height / 2,
      };
      const tsXScale = centerPos.translateX - scaleWidth / 2;
      const tsYScale = centerPos.translateY - scaleHeight / 2;

      if (tsXScale > 0) {
        targetX = (scaleWidth - width) / 2;
        targetX = targetX < 0 ? 0 : targetX;
      } else {
        const tsXEndScale = tsXScale + scaleWidth;
        if (tsXEndScale < width) {
          targetX = -(scaleWidth - width) / 2;
        }
      }

      if (tsYScale > 0) {
        targetY = (scaleHeight - imgSize.height) / 2;
        targetY = targetY < 0 ? 0 : targetY;
      } else {
        const tsYEndScale = tsYScale + scaleHeight;
        if (tsYEndScale < height) {
          if (targetScale > 1) {
            targetY = -(
              imgSize.height -
              (height - (scaleHeight - imgSize.height) / 2)
            );
          } else {
            targetY = -(imgSize.height - height);
          }
        }
      }

      scale.value = withTiming(targetScale);
      translateX.value = withTiming(targetX);
      translateY.value = withTiming(targetY);

      savedValue.value.scale = targetScale;
      savedValue.value.translateX = targetX;
      savedValue.value.translateY = targetY;

      if (onChangeZoomParams) {
        runOnJS(onChangeZoomParams)({
          scale: targetScale,
          translateX: targetX,
          translateY: targetY,
        });
      }
    });

  const panGesture = Gesture.Pan().onChange(e => {
    if (e.numberOfPointers === 2) {
      translateX.value = savedValue.value.translateX + e.translationX;
      translateY.value = savedValue.value.translateY + e.translationY;
    }
  });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {scale: scale.value},
        {translateY: translateY.value / scale.value},
      ],
      width,
      height: imgSize.height,
    };
  }, []);

  useEffect(() => {
    onChangeZoomParams?.({
      scale: 1,
      translateX: 0,
      translateY: -(imgSize.height - height) / 2,
    });
  }, [height, imgSize.height]);

  return (
    <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
      <View style={[containerStyle, {width, height}]}>
        <Animated.View style={style}>
          <StyleImage
            source={source}
            customStyle={$image}
            defaultImageSource="image"
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const EditZoomCropImage = (props: Props) => {
  const {imgSize} = useImageSize(
    'uri' in Object(props.source)
      ? (props.source as {uri: string}).uri ?? ''
      : '',
  );

  if (imgSize?.width) {
    return (
      <GestureImage
        {...props}
        imgSize={{
          width: props.width,
          height: (imgSize.height / imgSize.width) * props.width,
        }}
      />
    );
  }

  const {width, height, containerStyle} = props;

  return <View style={[containerStyle, {width, height}]} />;
};

const $image: ImageStyle = {
  width: '100%',
  height: '100%',
};

export default EditZoomCropImage;
