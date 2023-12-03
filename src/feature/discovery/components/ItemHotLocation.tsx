import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM, ratioAvatar} from 'asset';
import {Metrics, horizontalPadding} from 'asset/metrics';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {ImageStyle, TextStyle, ViewStyle} from 'react-native';
import {onGoToProfile} from 'utility/assistant';
import {scale, verticalScale} from 'utility/scale';

interface Props {
  item: TypeHotLocation;
  isLast?: boolean;
}

const ItemHotLocation = ({item, isLast}: Props) => {
  const theme = useTheme();

  return (
    <StyleTouchable
      customStyle={[$container, isLast && {marginBottom: 0}]}
      onPress={() => onGoToProfile(item?.id)}>
      <StyleImage
        source={{uri: item?.avatar}}
        customStyle={$image}
        defaultImageSource="image"
      />
      <StyleText originValue={item?.name} customStyle={$textName} />
      <StyleText
        originValue={item?.description}
        customStyle={[$textDescription, {color: theme.gray_500}]}
        numberOfLines={5}
      />
    </StyleTouchable>
  );
};

const width = Metrics.width - 2 * horizontalPadding;
const $container: ViewStyle = {
  marginBottom: verticalScale(20),
};
const $image: ImageStyle = {
  width,
  height: width * ratioAvatar,
  borderRadius: BORDER_RADIUS.f2,
};
const $textName: TextStyle = {
  fontSize: FONT_SIZE.f1,
  marginTop: verticalScale(4),
  fontWeight: FONT_WEIGHT_MEDIUM,
  paddingHorizontal: scale(2),
};
const $textDescription: TextStyle = {
  paddingHorizontal: scale(2),
};

export default ItemHotLocation;
