import {FONT_SIZE} from 'asset';
import {RELATIONSHIP} from 'asset/enum';
import {StyleText, StyleTouchable} from 'components/base';
import {Avatar} from 'components/common';
import {useTheme} from 'hook';
import React from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {onGoToProfile} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  item: TypeFollow;
  onFollow: () => void;
}

const ItemFollow = ({item, onFollow}: Props) => {
  const theme = useTheme();

  return (
    <StyleTouchable
      style={$container}
      onPress={() => onGoToProfile(item.id)}
      disable={!item.id}>
      <Avatar source={{uri: item?.avatar}} size={50} />

      <View style={$nameDescriptionView}>
        <StyleText
          originValue={item.name}
          customStyle={$textName}
          numberOfLines={1}
        />
        {!!item.description && (
          <StyleText
            originValue={item.description}
            customStyle={[$textDescription, {color: theme.gray_600}]}
            numberOfLines={1}
          />
        )}
      </View>

      <View style={$buttonFollowBox}>
        {item.relationship === RELATIONSHIP.notFollowing && (
          <StyleTouchable
            customStyle={[$buttonFollow, {backgroundColor: theme.p_100}]}
            onPress={onFollow}>
            <StyleText i18Text="profile.follow" customStyle={$textFollow} />
          </StyleTouchable>
        )}
      </View>
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
};
const $nameDescriptionView: TextStyle = {
  flex: 1,
  justifyContent: 'center',
  paddingLeft: scale(12),
};
const $textName: TextStyle = {
  fontWeight: 'bold',
};
const $textDescription: TextStyle = {
  fontSize: FONT_SIZE.f3,
  marginTop: verticalScale(2),
};
const $buttonFollowBox: ViewStyle = {
  width: moderateScale(80),
  alignItems: 'center',
  justifyContent: 'center',
};
const $buttonFollow: ViewStyle = {
  width: '100%',
  paddingVertical: verticalScale(8),
  alignItems: 'center',
  borderRadius: 30,
};
const $textFollow: TextStyle = {
  fontSize: FONT_SIZE.f4,
  fontWeight: 'bold',
};

export default ItemFollow;
