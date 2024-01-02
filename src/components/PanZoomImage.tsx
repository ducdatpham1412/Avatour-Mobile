import {Metrics} from 'asset/metrics';
import {ModalAlert} from 'navigation/screen/modals';
import React from 'react';
import {ImageStyle, View, ViewStyle} from 'react-native';
import Pinchable from 'react-native-pinchable';
import RNFetchBlob from 'rn-fetch-blob';
import {isIOS} from 'utility/assistant';
import {checkSaveImage} from 'utility/permission/permission';
import AutoHeightImage from './AutoHeightImage';
import {StyleTouchable} from './base';

interface PanImageProps {
  uri: string;
  onPressBackground?: () => void;
}

const onSaveToLibrary = async (uri: string) => {
  try {
    if (isIOS) {
      //   await CameraRoll.save(uri, {
      //     type: 'photo',
      //   });
    } else {
      await checkSaveImage();
      const res = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
      }).fetch('GET', uri);
      //   await CameraRoll.save(`file://${res.data}`, {
      //     type: 'photo',
      //     album: 'Avatour',
      //   });
    }
  } catch (err) {
    ModalAlert.error({
      content: err,
    });
  }
};

const PanZoomImage = ({uri, onPressBackground}: PanImageProps) => {
  return (
    <View style={$container}>
      <StyleTouchable
        style={$background}
        onPress={onPressBackground}
        activeOpacity={1}
      />

      <View style={$imgBox}>
        <Pinchable miminimumZoomScale={0.1}>
          <AutoHeightImage
            uri={uri}
            customStyle={$image}
            defaultImageSource="image"
          />
        </Pinchable>
      </View>
    </View>
  );
};

const $container: ViewStyle = {
  width: Metrics.width,
  height: Metrics.height,
  justifyContent: 'center',
};
const $imgBox: ViewStyle = {
  position: 'absolute',
  width: '100%',
};
const $image: ImageStyle = {
  width: '100%',
};
const $background: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
};

export default PanZoomImage;
