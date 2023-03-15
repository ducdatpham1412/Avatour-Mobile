import Images from 'asset/img/images';
import React from 'react';
import {Image, ImageProps, ImageStyle, StyleProp} from 'react-native';

interface Props extends ImageProps {
  customStyle?: StyleProp<ImageStyle>;
  defaultImageSource?: 'avatar' | 'image';
}

const StyleImage = ({
  defaultImageSource = 'avatar',
  customStyle,
  ...rest
}: Props) => {
  let defaultSource = undefined;
  if (defaultImageSource === 'avatar') {
    defaultSource = Images.images.defaultAvatar;
  } else if (defaultImageSource === 'image') {
    defaultSource = Images.images.defaultImage;
  }

  return <Image defaultSource={defaultSource} style={customStyle} {...rest} />;
};

export default StyleImage;
