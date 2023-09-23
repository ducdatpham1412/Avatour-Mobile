import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM, ratioAvatar} from 'asset';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import React, {memo, useState} from 'react';
import isEqual from 'react-fast-compare';
import {ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {scale, verticalScale} from 'utility/scale';

interface Props {
  item: TypeGetProfileResponse;
  containerStyle?: StyleProp<ViewStyle>;
}

const ItemShop = ({item, containerStyle}: Props) => {
  const theme = useTheme();
  const [width, setWidth] = useState(0);

  return (
    <StyleTouchable
      style={[$container, containerStyle]}
      onLayout={({nativeEvent: {layout}}) => {
        setWidth(layout.width);
      }}
      onPress={() =>
        navigate(ROOT_SCREEN.otherProfile, {
          id: item.id,
          initValue: item,
        })
      }>
      <StyleImage
        source={{uri: item.avatar}}
        customStyle={[$image, {width, height: width * ratioAvatar}]}
        defaultImageSource="image"
      />
      <StyleText
        originValue={item.name}
        numberOfLines={1}
        customStyle={$name}
      />
      <StyleText
        originValue={item.description}
        numberOfLines={1}
        customStyle={[$description, {color: theme.gray_500}]}
      />
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: scale(150),
};
const $image: ImageStyle = {
  borderRadius: BORDER_RADIUS.f3,
};
const $name: TextStyle = {
  fontSize: FONT_SIZE.f3,
  fontWeight: FONT_WEIGHT_MEDIUM,
  marginTop: verticalScale(4),
};
const $description: TextStyle = {
  fontSize: FONT_SIZE.f3,
  marginTop: verticalScale(2),
};

export default memo(ItemShop, (pre: Props, next: Props) => {
  if (!isEqual(pre.item, next.item)) {
    return false;
  }
  return true;
});
