import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {RELATIONSHIP} from 'asset/enum';
import {horizontalMargin} from 'asset/metrics';
import {StyleText, StyleTouchable} from 'components/base';
import {Avatar} from 'components/common';
import {useTheme} from 'hook';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, TextStyle, View, ViewStyle} from 'react-native';
import {moderateScale} from 'utility/scale';

interface Props {
  item: TypeUserLike;
  onPressFollow: () => void;
  onPress: () => void;
  loading: boolean;
}

const ItemUserLiked = ({item, onPress, onPressFollow, loading}: Props) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  return (
    <StyleTouchable customStyle={$container} onPress={onPress}>
      <Avatar source={{uri: item.creator.avatar}} size={40} />
      <View style={$textBox}>
        <StyleText
          originValue={`${
            item.creator?.id === myId ? `(${t('common.you')}) ` : ''
          }${item.creator.name}`}
          customStyle={$textName}
          numberOfLines={1}
        />
        <StyleText
          originValue={item.creator.description}
          customStyle={[$description, {color: theme.gray_500}]}
          numberOfLines={1}
        />
      </View>
      {item.creator?.relationship === RELATIONSHIP.notFollowing && (
        <StyleTouchable
          customStyle={[$btn, {backgroundColor: theme.p_600}]}
          onPress={onPressFollow}>
          {loading ? (
            <ActivityIndicator color={theme.white} />
          ) : (
            <StyleText
              i18Text="profile.follow"
              customStyle={[$textBtn, {color: theme.white}]}
            />
          )}
        </StyleTouchable>
      )}
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  gap: horizontalMargin,
};
const $textBox: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
};
const $textName: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $description: TextStyle = {
  fontSize: FONT_SIZE.f3,
};
const $btn: ViewStyle = {
  width: moderateScale(90),
  height: moderateScale(28),
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
};
const $textBtn: TextStyle = {
  fontSize: FONT_SIZE.f3,
  fontWeight: FONT_WEIGHT_MEDIUM,
};

export default ItemUserLiked;
