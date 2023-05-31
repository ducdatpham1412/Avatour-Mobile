import Images from 'asset/img/images';
import React, {useState} from 'react';
import {Image, ImageProps, ImageStyle, StyleProp} from 'react-native';
import {isIOS} from 'utility/assistant';

interface Props extends ImageProps {
  customStyle?: StyleProp<ImageStyle>;
  defaultImageSource?: 'avatar' | 'image';
}

const ImageIOS = ({
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

const ImageAndroid = ({
  defaultImageSource = 'avatar',
  customStyle,
  source,
  ...rest
}: Props) => {
  let defaultSource = undefined;
  if (defaultImageSource === 'avatar') {
    defaultSource = Images.images.defaultAvatar;
  } else if (defaultImageSource === 'image') {
    defaultSource = Images.images.defaultImage;
  }

  const [error, setError] = useState(false);

  if (error) {
    return <Image source={defaultSource} style={customStyle} {...rest} />;
  }

  return (
    <Image
      source={source}
      style={customStyle}
      {...rest}
      onError={() => setError(true)}
    />
  );
};

const StyleImage = (props: Props) => {
  if (isIOS) {
    return <ImageIOS {...props} />;
  }
  return <ImageAndroid {...props} />;
};

export default StyleImage;
