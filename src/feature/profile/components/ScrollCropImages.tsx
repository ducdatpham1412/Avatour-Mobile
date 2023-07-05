/* eslint-disable no-shadow */
import {ratioImageSale} from 'asset';
import Theme from 'asset/theme/Theme';
import {TabViewDynamic} from 'components';
import {StyleImage, StyleTouchable} from 'components/base';
import {ButtonX} from 'components/common';
import {useTheme} from 'hook';
import React, {ElementRef, useEffect, useRef, useState} from 'react';
import {Animated, Image, ImageStyle, View, ViewStyle} from 'react-native';
import {ScaledSheet, scale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAnimatedValue} from 'utility/animation';

interface Props {
  images: Array<string>;
  index?: number;
  width: number;
  height: number;
  initRatio?: number;
  imageFocusing?: string;
  havingZoomButton?: boolean;
  onChangeCropperParams?: (params: {url: string; value: any}) => void;
  onChangeCropperSize?: (params: {width: number; height: number}) => void;
  onRemoveImage?: (url: string) => void;
  enableRemoveImage?: boolean;
}

const indicatorPointWidth = scale(10);
const marginIndicatorPoint = scale(5);
const minRatio = 0.7;

const ScrollCropImages = (props: Props) => {
  const {
    images,
    index,
    onChangeCropperSize,
    width,
    height,
    initRatio,
    imageFocusing,
    havingZoomButton,
    onRemoveImage,
    enableRemoveImage = true,
  } = props;

  const theme = useTheme();

  const numberTabs = images.length;
  const layOutWidth = width * numberTabs;
  const indicatorWidth =
    indicatorPointWidth * numberTabs + marginIndicatorPoint * (numberTabs - 1);

  const checkCropRef = useRef<any>(null);
  const tabImageRef = useRef<ElementRef<typeof TabViewDynamic>>(null);
  const aimWidth = useRef(new Animated.Value(1)).current;
  const aimHeight = useRef(new Animated.Value(1)).current;

  const [cropWidth, setCropWidth] = useState(width);
  const [cropHeight, setCropHeight] = useState(
    width * (initRatio ?? ratioImageSale),
  );
  const [typeZoom, setTypeZoom] = useState<'square' | 'free'>('square');

  aimWidth.addListener(({value}) => setCropWidth(value * width));
  aimHeight.addListener(({value}) => setCropHeight(value * width));

  const translateXIndicator = useAnimatedValue(0);

  useEffect(() => {
    clearTimeout(checkCropRef.current);
    checkCropRef.current = setTimeout(() => {
      onChangeCropperSize?.({width: cropWidth, height: cropHeight});
    }, 100);
  }, [cropWidth, cropHeight]);

  useEffect(() => {
    if (index !== undefined) {
      tabImageRef.current?.navigateToIndex(index);
    }
  }, [index]);

  const onChangeTypeZoom = () => {
    if (!havingZoomButton || !imageFocusing) {
      return;
    }
    if (typeZoom === 'square') {
      Image.getSize(imageFocusing, (w, h) => {
        setTypeZoom('free');
        if (w < h) {
          const ratio = w / h < minRatio ? minRatio : w / h;
          Animated.spring(aimWidth, {
            toValue: ratio,
            useNativeDriver: true,
          }).start();
        } else {
          const ratio = h / w < minRatio ? minRatio : h / w;
          Animated.spring(aimHeight, {
            toValue: ratio,
            useNativeDriver: true,
          }).start();
        }
      });
    } else {
      setTypeZoom('square');
      Animated.parallel(
        [
          Animated.spring(aimWidth, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.spring(aimHeight, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ],
        {stopTogether: false},
      ).start();
    }
  };

  return (
    <View style={[$container, {width, height}]}>
      <TabViewDynamic
        ref={tabImageRef}
        width={width}
        onScroll={value => {
          if (layOutWidth !== 0) {
            const newTranslateX =
              (-value / layOutWidth) * (indicatorWidth + marginIndicatorPoint);
            translateXIndicator.setValue(newTranslateX);
          }
        }}>
        {images.map((url, index) => (
          <View
            key={index}
            style={[
              $imageBox,
              {
                width,
                height,
              },
            ]}>
            <StyleImage
              source={{uri: url}}
              customStyle={$image}
              defaultImageSource="image"
            />
            {images.length > 1 && !!enableRemoveImage && (
              <ButtonX
                containerStyle={{backgroundColor: theme.white_opacity(0.6)}}
                onPress={() => onRemoveImage?.(url)}
                size={17}
              />
            )}
            {/* <EditZoomCropImage
              width={cropWidth}
              height={cropHeight}
              url={url}
              onChangeCropperParams={onChangeCropperParams}
            /> */}
          </View>
        ))}
      </TabViewDynamic>

      {numberTabs >= 2 && (
        <View style={[styles.indicatorView, {width: indicatorWidth}]}>
          {Array(numberTabs)
            .fill(0)
            .map((_, ind) => (
              <View key={ind} style={styles.afterBox} />
            ))}
          <Animated.View
            style={[
              styles.indicator,
              {transform: [{translateX: translateXIndicator}]},
            ]}
          />
        </View>
      )}

      {havingZoomButton && (
        <StyleTouchable
          style={styles.zoomBox}
          onPress={onChangeTypeZoom}
          hitSlop={10}>
          {typeZoom === 'square' ? (
            <MaterialIcons name="zoom-out-map" style={styles.iconZoom} />
          ) : (
            <AntDesign name="minussquareo" style={styles.iconZoom} />
          )}
        </StyleTouchable>
      )}
    </View>
  );
};

const $container: ViewStyle = {
  overflow: 'hidden',
  backgroundColor: Theme.newTheme.black,
};
const $imageBox: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
};
const $image: ImageStyle = {
  width: '100%',
  height: '100%',
};

const styles = ScaledSheet.create({
  indicatorView: {
    position: 'absolute',
    height: '2.5@ms',
    alignSelf: 'center',
    bottom: '2@ms',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  afterBox: {
    width: indicatorPointWidth,
    height: '100%',
    backgroundColor: Theme.common.grayLight,
    borderRadius: 10,
  },
  indicator: {
    width: indicatorPointWidth,
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
    backgroundColor: Theme.newTheme.likeHeart,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  // zoom box
  zoomBox: {
    position: 'absolute',
    right: '10@s',
    bottom: '10@s',
  },
  iconZoom: {
    fontSize: '20@ms',
    color: Theme.common.white,
  },
});

export default ScrollCropImages;
