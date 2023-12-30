import Theme from 'asset/theme/Theme';
import {TabViewDynamic} from 'components';
import {StyleImage, StyleTouchable} from 'components/base';
import {ButtonX} from 'components/common';
import {useTheme} from 'hook';
import React, {ElementRef, useEffect, useRef} from 'react';
import {Animated, ImageStyle, View, ViewStyle} from 'react-native';
import {scale} from 'react-native-size-matters';
import {useAnimatedValue} from 'utility/animation';
import {moderateScale} from 'utility/scale';
import EditZoomCropImage from './EditZoomCropImage';

interface Props {
  images: Array<string>;
  index?: number;
  width: number;
  height: number;
  zoomEnable?: boolean;
  onChangeCropperParams?: (params: {
    url: string;
    value: ZoomImageParams;
  }) => void;
  onRemoveImage?: (url: string) => void;
  onPressImage?: (url: string) => void;
  enableRemoveImage?: boolean;
}

// type RenderImage = Props & {
//   url: string;
//   theme: TypeTheme;
// };

const indicatorPointWidth = scale(10);
const marginIndicatorPoint = scale(5);

// TODO: Check to render with TabView here
// const renderImage = ({
//   zoomEnable,
//   index,
//   url,
//   width,
//   height,
//   images,
//   enableRemoveImage,
//   theme,
//   onRemoveImage,
//   onPressImage,
//   onChangeCropperParams,
// }: RenderImage) => {
//   return () => (
//     <StyleTouchable
//       key={index}
//       style={[
//         $imageBox,
//         {
//           width,
//           height,
//         },
//       ]}
//       disable={!onPressImage}
//       disableOpacity={1}
//       onPress={() => onPressImage?.(url)}>
//       {zoomEnable ? (
//         <EditZoomCropImage
//           source={{uri: url}}
//           width={width}
//           height={height}
//           onChangeZoomParams={e => {
//             onChangeCropperParams?.({
//               url,
//               value: e,
//             });
//           }}
//         />
//       ) : (
//         <StyleImage
//           source={{uri: url}}
//           customStyle={$image}
//           defaultImageSource="image"
//         />
//       )}
//       {images.length > 1 && !!enableRemoveImage && (
//         <ButtonX
//           containerStyle={{backgroundColor: theme.white_opacity(0.8)}}
//           onPress={() => onRemoveImage?.(url)}
//           size={17}
//         />
//       )}
//     </StyleTouchable>
//   );
// };

const ScrollCropImages = (props: Props) => {
  const {
    images,
    index,
    width,
    height,
    zoomEnable = false,
    onRemoveImage,
    onPressImage,
    onChangeCropperParams,
    enableRemoveImage = true,
  } = props;

  const theme = useTheme();

  const numberTabs = images.length;
  const layOutWidth = width * numberTabs;
  const indicatorWidth =
    indicatorPointWidth * numberTabs + marginIndicatorPoint * (numberTabs - 1);

  const translateXIndicator = useAnimatedValue(0);

  const tabImageRef = useRef<ElementRef<typeof TabViewDynamic>>(null);
  //   const tabViewRef = useRef<ElementRef<typeof TabView>>(null);

  useEffect(() => {
    if (index !== undefined) {
      tabImageRef.current?.navigateToIndex(index);
    }
  }, [index]);

  const tabImages = () => {
    return (
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
        {images.map((url, idx) => (
          <StyleTouchable
            key={idx}
            style={[
              $imageBox,
              {
                width,
                height,
              },
            ]}
            disable={!onPressImage}
            disableOpacity={1}
            onPress={() => onPressImage?.(url)}>
            {zoomEnable ? (
              <EditZoomCropImage
                source={{uri: url}}
                width={width}
                height={height}
                onChangeZoomParams={e => {
                  onChangeCropperParams?.({
                    url,
                    value: e,
                  });
                }}
              />
            ) : (
              <StyleImage
                source={{uri: url}}
                customStyle={$image}
                defaultImageSource="image"
              />
            )}
            {images.length > 1 && !!enableRemoveImage && (
              <ButtonX
                containerStyle={{backgroundColor: theme.white_opacity(0.8)}}
                onPress={() => onRemoveImage?.(url)}
                size={17}
              />
            )}
          </StyleTouchable>
        ))}
      </TabViewDynamic>
    );

    // if (zoomEnable) {
    //   return (
    //     <TabViewDynamic
    //       ref={tabImageRef}
    //       width={width}
    //       onScroll={value => {
    //         if (layOutWidth !== 0) {
    //           const newTranslateX =
    //             (-value / layOutWidth) *
    //             (indicatorWidth + marginIndicatorPoint);
    //           translateXIndicator.setValue(newTranslateX);
    //         }
    //       }}>
    //       {images.map((url, idx) => (
    //         <StyleTouchable
    //           key={idx}
    //           style={[
    //             $imageBox,
    //             {
    //               width,
    //               height,
    //             },
    //           ]}
    //           disable={!onPressImage}
    //           disableOpacity={1}
    //           onPress={() => onPressImage?.(url)}>
    //           {zoomEnable ? (
    //             <EditZoomCropImage
    //               source={{uri: url}}
    //               width={width}
    //               height={height}
    //               onChangeZoomParams={e => {
    //                 onChangeCropperParams?.({
    //                   url,
    //                   value: e,
    //                 });
    //               }}
    //             />
    //           ) : (
    //             <StyleImage
    //               source={{uri: url}}
    //               customStyle={$image}
    //               defaultImageSource="image"
    //             />
    //           )}
    //           {images.length > 1 && !!enableRemoveImage && (
    //             <ButtonX
    //               containerStyle={{backgroundColor: theme.white_opacity(0.8)}}
    //               onPress={() => onRemoveImage?.(url)}
    //               size={17}
    //             />
    //           )}
    //         </StyleTouchable>
    //       ))}
    //     </TabViewDynamic>
    //   );
    // }

    // return (
    //   <TabView
    //     ref={tabViewRef}
    //     tabBarType="none"
    //     style={{flex: 1}}
    //     listElements={images.map((url, idx) =>
    //       renderImage({
    //         url,
    //         zoomEnable,
    //         index: idx,
    //         width,
    //         height,
    //         images,
    //         enableRemoveImage,
    //         theme,
    //         onRemoveImage,
    //         onPressImage,
    //         onChangeCropperParams,
    //       }),
    //     )}
    //   />
    // );
  };

  return (
    <View style={[$container, {width, height}]}>
      {tabImages()}

      {numberTabs >= 2 && (
        <View style={[$indicator, {width: indicatorWidth}]}>
          {Array(numberTabs)
            .fill(0)
            .map((_, ind) => (
              <View key={ind} style={$after} />
            ))}
          <Animated.View
            style={[
              $indicatorBox,
              {transform: [{translateX: translateXIndicator}]},
            ]}
          />
        </View>
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
const $indicator: ViewStyle = {
  position: 'absolute',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignSelf: 'center',
  height: moderateScale(2.5),
  bottom: moderateScale(2),
};
const $after: ViewStyle = {
  width: indicatorPointWidth,
  height: '100%',
  backgroundColor: Theme.common.grayLight,
  borderRadius: moderateScale(12),
};
const $indicatorBox: ViewStyle = {
  width: indicatorPointWidth,
  height: '100%',
  borderRadius: 10,
  position: 'absolute',
  backgroundColor: Theme.newTheme.orange,
};

export default ScrollCropImages;
