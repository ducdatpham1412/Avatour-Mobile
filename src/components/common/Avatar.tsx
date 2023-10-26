import Images from 'asset/img/images';
import {StyleIcon} from 'components/base';
import React from 'react';
import {
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from 'react-native';

interface Props {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  size?: number;
  defaultSource?: ImageProps['defaultSource'];
}

const Avatar = ({source, style, size, defaultSource}: Props) => {
  return (
    <StyleIcon
      source={source}
      size={size}
      customStyle={[{borderRadius: 1000}, style]}
      resizeMode="cover"
      defaultSource={defaultSource ?? Images.images.defaultAvatar}
    />
  );
};

export default Avatar;
