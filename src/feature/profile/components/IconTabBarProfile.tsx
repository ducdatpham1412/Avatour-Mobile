import {FONT_SIZE} from 'asset';
import {StyleIcon, StyleText} from 'components/base';
import React from 'react';
import {ImageSourcePropType, TextStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';

interface IconTabBarProps {
  icon: ImageSourcePropType;
  title: I18Normalize;
}

const IconTabBarProfile = ({icon, title}: IconTabBarProps) => {
  return (
    <>
      <StyleIcon source={icon} size={12} />
      <StyleText i18Text={title} customStyle={$title} />
    </>
  );
};

const $title: TextStyle = {
  fontSize: FONT_SIZE.f5,
  marginTop: 2,
};

export default IconTabBarProfile;
