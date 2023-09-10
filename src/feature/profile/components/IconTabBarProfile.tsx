import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {StyleIcon, StyleText} from 'components/base';
import React, {isValidElement} from 'react';
import {ImageSourcePropType, TextStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {verticalScale} from 'utility/scale';

interface IconTabBarProps {
  icon: ImageSourcePropType | Element;
  title: I18Normalize;
}

const IconTabBarProfile = ({icon, title}: IconTabBarProps) => {
  return (
    <>
      {isValidElement(icon) ? icon : <StyleIcon source={icon} size={17} />}
      <StyleText i18Text={title} customStyle={$title} />
    </>
  );
};

const $title: TextStyle = {
  fontSize: FONT_SIZE.f5,
  fontWeight: FONT_WEIGHT_MEDIUM,
  marginTop: verticalScale(4),
};

export default IconTabBarProfile;
