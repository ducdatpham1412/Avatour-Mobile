/* eslint-disable no-underscore-dangle */
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {Metrics} from 'asset/metrics';
import Redux from 'hook/useRedux';
import {ModalAlert} from 'navigation/screen/modals';
import React from 'react';
import {View} from 'react-native';
import Pinchable from 'react-native-pinchable';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNFetchBlob from 'rn-fetch-blob';
import {isIOS} from 'utility/assistant';
import {checkSaveImage} from 'utility/permission/permission';
import AutoHeightImage from './AutoHeightImage';
import {StyleTouchable} from './base';

interface PanImageProps {
  uri: string;
}

// interface Point {
//     x: number;
//     y: number;
// }

/**
 * For animation
 */
// const screenWidth = Metrics.width;
// const calculateDistance = (point1: Point, point2: Point) => {
//     return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
// };
// const tan30 = Math.sqrt(3) / 4;
// const tan60 = 1 / Math.sqrt(3);
// const selectDirectionMove = (pre: any, next: Point) => {
//     const dX = next.x - pre.x._value;
//     const dY = next.y - pre.y._value;
//     const tan = dX / dY;

//     if (tan > -tan30 && tan < tan30) {
//         if (dY < 0) return 'down';
//         if (dY > 0) return 'up';
//     } else if (tan > tan60 || tan < -tan60) {
//         if (dX < 0) return 'right';
//         if (dX > 0) return 'left';
//     }
//     return null;
// };

// Save image
const onSaveToLibrary = async (uri: string) => {
  try {
    if (isIOS) {
      await CameraRoll.save(uri, {
        type: 'photo',
      });
    } else {
      await checkSaveImage();
      const res = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
      }).fetch('GET', uri);
      await CameraRoll.save(`file://${res.data}`, {
        type: 'photo',
        album: 'Avatour',
      });
    }
  } catch (err) {
    ModalAlert.error({
      content: err,
    });
  }
};

const PanZoomImage = ({uri}: PanImageProps) => {
  const theme = Redux.getTheme();

  // const scale = useRef(new Animated.Value(1)).current;
  // const translate = useRef(new Animated.ValueXY()).current;
  // const initDistance = useRef(new Animated.Value(0)).current;

  // const preTouch0 = useRef(new Animated.ValueXY()).current;
  // const preTouch1 = useRef(new Animated.ValueXY()).current;
  // let isConsidering = useRef(false).current;

  // const panResponder = useRef(
  //     PanResponder.create({
  //         onMoveShouldSetPanResponder: () => true,
  //         onPanResponderStart: e => {
  //             const {touches} = e.nativeEvent;
  //             if (touches.length === 2) {
  //                 initDistance.setValue(
  //                     calculateDistance(
  //                         {x: touches[0].pageX, y: touches[0].pageY},
  //                         {x: touches[1].pageX, y: touches[1].pageY},
  //                     ),
  //                 );
  //             }
  //         },
  //         onPanResponderGrant: e => {
  //             const {touches} = e.nativeEvent;
  //             if (touches.length === 2) {
  //                 initDistance.setValue(
  //                     calculateDistance(
  //                         {x: touches[0].pageX, y: touches[0].pageY},
  //                         {x: touches[1].pageX, y: touches[1].pageY},
  //                     ),
  //                 );
  //                 preTouch0.setValue({
  //                     x: touches[0].pageX,
  //                     y: touches[0].pageY,
  //                 });
  //                 preTouch1.setValue({
  //                     x: touches[1].pageX,
  //                     y: touches[1].pageY,
  //                 });
  //             }
  //         },
  //         onPanResponderMove: (e, ges) => {
  //             const {touches} = e.nativeEvent;
  //             if (touches.length === 1) {
  //                 translate.setValue({
  //                     x: ges.dx,
  //                     y: ges.dy,
  //                 });
  //                 if (ges.dy >= screenWidth) {
  //                     goBack();
  //                 }
  //             } else if (touches.length === 2) {
  //                 if (!isConsidering) {
  //                     isConsidering = true;
  //                     const direction0 = selectDirectionMove(preTouch0, {
  //                         x: touches[0].pageX,
  //                         y: touches[0].pageY,
  //                     });
  //                     const direction1 = selectDirectionMove(preTouch1, {
  //                         x: touches[1].pageX,
  //                         y: touches[1].pageY,
  //                     });
  //                     if (
  //                         direction0 &&
  //                         direction1 &&
  //                         direction0 === direction1
  //                     ) {
  //                         translate.setValue({
  //                             x: ges.dx,
  //                             y: ges.dy,
  //                         });
  //                     } else {
  //                         const newDistance = calculateDistance(
  //                             {x: touches[0].pageX, y: touches[0].pageY},
  //                             {x: touches[1].pageX, y: touches[1].pageY},
  //                         );
  //                         const temp: any = initDistance;
  //                         if (temp._value !== 0) {
  //                             scale.setValue(newDistance / temp._value);
  //                         }
  //                     }
  //                     preTouch0.setValue({
  //                         x: touches[0].pageX,
  //                         y: touches[0].pageY,
  //                     });
  //                     preTouch1.setValue({
  //                         x: touches[1].pageX,
  //                         y: touches[1].pageY,
  //                     });
  //                     isConsidering = false;
  //                 }
  //             }
  //         },
  //         onPanResponderRelease: () => {
  //             Animated.spring(scale, {
  //                 toValue: 1,
  //                 useNativeDriver: true,
  //             }).start();
  //             Animated.spring(translate, {
  //                 toValue: {
  //                     x: 0,
  //                     y: 0,
  //                 },
  //                 useNativeDriver: true,
  //             }).start();
  //         },
  //     }),
  // ).current;

  return (
    <View style={styles.imageView}>
      {/* <Animated.View
                style={{
                    paddingVertical: 20,
                    transform: [
                        {scale},
                        {translateX: translate.x},
                        {translateY: translate.y},
                    ],
                }}
                {...panResponder.panHandlers}>
                <AutoHeightImage uri={uri} customStyle={styles.image} />
            </Animated.View> */}
      <Pinchable miminimumZoomScale={0.3}>
        <AutoHeightImage uri={uri} customStyle={styles.image} />
      </Pinchable>

      {false && (
        <StyleTouchable
          customStyle={[
            styles.saveTouch,
            {backgroundColor: theme.backgroundButtonColor},
          ]}
          hitSlop={15}
          onPress={() => onSaveToLibrary(uri)}>
          <AntDesign
            name="arrowdown"
            style={[styles.iconSave, {color: theme.textColor}]}
          />
        </StyleTouchable>
      )}
    </View>
  );
};

const styles = ScaledSheet.create({
  imageView: {
    width: Metrics.width,
    height: Metrics.height,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    borderRadius: '5@s',
  },
  saveTouch: {
    position: 'absolute',
    padding: '4@ms',
    borderRadius: '20@ms',
    right: '20@s',
    bottom: Metrics.safeBottomPadding + verticalScale(20),
  },
  iconSave: {
    fontSize: '16@ms',
  },
});

export default PanZoomImage;
