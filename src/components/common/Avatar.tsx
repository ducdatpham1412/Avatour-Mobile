import {StyleIcon} from 'components/base';
import React from 'react';
import {ImageSourcePropType, ImageStyle, StyleProp} from 'react-native';

interface Props {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  size?: number;
}

const Avatar = ({source, style, size}: Props) => {
  return (
    <StyleIcon
      source={source}
      size={size}
      customStyle={[{borderRadius: 1000}, style]}
      resizeMode="cover"
    />
  );
};

export default Avatar;
