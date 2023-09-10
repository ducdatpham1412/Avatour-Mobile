import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {Metrics} from 'asset/metrics';
import {useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React from 'react';
import {ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import Pinchable from 'react-native-pinchable';
import {verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNFetchBlob from 'rn-fetch-blob';
import {isIOS} from 'utility/assistant';
import {checkSaveImage} from 'utility/permission/permission';
import {moderateScale, scale} from 'utility/scale';
import AutoHeightImage from './AutoHeightImage';
import {StyleTouchable} from './base';

interface PanImageProps {
  uri: string;
}

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
  const theme = useTheme();

  return (
    <View style={$container}>
      <Pinchable miminimumZoomScale={0.3}>
        <AutoHeightImage
          uri={uri}
          customStyle={$image}
          defaultImageSource="image"
        />
      </Pinchable>

      {false && (
        <StyleTouchable
          customStyle={[$saveTouch, {backgroundColor: theme.background}]}
          hitSlop={15}
          onPress={() => onSaveToLibrary(uri)}>
          <AntDesign
            name="arrowdown"
            style={[$iconSave, {color: theme.black}]}
          />
        </StyleTouchable>
      )}
    </View>
  );
};

const $container: ViewStyle = {
  width: Metrics.width,
  height: Metrics.height,
  justifyContent: 'center',
};
const $image: ImageStyle = {
  width: '100%',
};
const $saveTouch: ViewStyle = {
  position: 'absolute',
  padding: scale(4),
  borderRadius: moderateScale(20),
  right: scale(20),
  bottom: Metrics.safeBottomPadding + verticalScale(20),
};
const $iconSave: TextStyle = {
  fontSize: moderateScale(16),
};

export default PanZoomImage;
