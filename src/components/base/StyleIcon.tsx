import Images from 'asset/img/images';
import React, {useState} from 'react';
import {Image, ImageProps, ImageStyle, StyleProp} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {isIOS} from 'utility/assistant';

interface Props extends ImageProps {
  size?: number;
  customStyle?: StyleProp<ImageStyle>;
}

const IconIOS = (props: Props) => {
  const {size = 1, customStyle} = props;

  return (
    <Image
      style={[
        {width: moderateScale(size), height: moderateScale(size)},
        customStyle,
      ]}
      resizeMode="contain"
      defaultSource={Images.images.defaultAvatar}
      {...props}
    />
  );
};

const IconAndroid = ({source, ...rest}: Props) => {
  const {size = 1, customStyle} = rest;
  const [error, setError] = useState(false);

  if (error) {
    return (
      <Image
        resizeMode="contain"
        source={Images.images.defaultAvatar}
        {...rest}
        style={[
          {width: moderateScale(size), height: moderateScale(size)},
          customStyle,
        ]}
      />
    );
  }

  return (
    <Image
      resizeMode="contain"
      source={source}
      {...rest}
      style={[
        {width: moderateScale(size), height: moderateScale(size)},
        customStyle,
      ]}
      onError={() => setError(true)}
    />
  );
};

const StyleIcon = (props: Props) => {
  if (isIOS) {
    return <IconIOS {...props} />;
  }
  return <IconAndroid {...props} />;
};

export default StyleIcon;
