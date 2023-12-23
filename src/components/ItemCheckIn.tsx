import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  ratioImageCheckIn,
} from 'asset';
import {Metrics, horizontalPadding} from 'asset/metrics';
import {useTheme} from 'hook';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {TextStyle, View, ViewStyle} from 'react-native';
import {
  onGoToProfile,
  renderIconFeeling,
  seeDetailImage,
} from 'utility/assistant';
import {formatDDMMYYYY} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';
import ScrollCropImages from './ScrollCropImages';
import Stars from './Stars';
import TextReadMore from './TextReadMore';
import {StyleIcon, StyleText, StyleTouchable} from './base';
import {Avatar} from './common';

interface Props {
  item: TypeCheckIn;
}

const width = Metrics.width - 2 * horizontalPadding;

const ItemCheckIn = ({item}: Props) => {
  const theme = useTheme();

  const goToProfile = () => {
    onGoToProfile(item.creator.id);
  };

  return (
    <View style={$container}>
      <View style={$header}>
        <StyleTouchable onPress={goToProfile}>
          <Avatar source={{uri: item.creator.avatar}} size={30} />
        </StyleTouchable>
        <View style={$contentHeader}>
          <StyleText>
            <StyleText
              originValue={item.creator.name}
              customStyle={$name}
              onPress={goToProfile}
            />
            <StyleText
              originValue={`・ ${formatDDMMYYYY(item.created)}`}
              customStyle={[$time, {color: theme.gray_500}]}
            />
          </StyleText>
          <View style={$rating}>
            {item.feeling !== null && (
              <StyleIcon source={renderIconFeeling(item.feeling)} size={20} />
            )}
            {item.stars && <Stars value={item.stars} />}
          </View>
        </View>
      </View>

      <TextReadMore value={item.content} minRows={2} />

      {!!item.images?.length && (
        <ScrollCropImages
          images={item.images}
          width={width}
          height={width * ratioImageCheckIn}
          containerStyle={$image}
          onPressImage={(_, index) => {
            seeDetailImage({
              images: item.images,
              initIndex: index,
            });
          }}
        />
      )}
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
  gap: verticalScale(8),
};
const $header: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  gap: scale(8),
};
const $contentHeader: ViewStyle = {
  flex: 1,
  gap: verticalScale(4),
};
const $name: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $time: TextStyle = {
  fontSize: FONT_SIZE.f5,
};
const $rating: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: scale(16),
};
const $image: ViewStyle = {
  borderRadius: BORDER_RADIUS.f2,
};

export default memo(ItemCheckIn, (pre, next) => {
  return isEqual(pre, next);
});
