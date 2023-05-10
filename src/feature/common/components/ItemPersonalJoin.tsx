import {BORDER_RADIUS} from 'asset';
import {
  StyleButton,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {TextStyle, Vibration, View, ViewStyle} from 'react-native';
import {onGoToProfile} from 'utility/assistant';
import {scale, verticalScale} from 'utility/scale';

interface Props {
  item: TypePersonalJoin;
}

const ItemPersonalJoin = ({item}: Props) => {
  const theme = useTheme();
  return (
    <StyleTouchable
      style={[$container, {backgroundColor: theme.white}]}
      onPress={() => onGoToProfile(item?.creator)}>
      <StyleIcon source={{uri: item?.creator_avatar}} size={40} />
      <StyleText
        originValue={item?.creator_name}
        customStyle={$name}
        numberOfLines={2}
      />
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: scale(12),
  paddingVertical: verticalScale(4),
  borderRadius: BORDER_RADIUS.f2,
};
const $name: TextStyle = {
  marginLeft: scale(8),
  fontWeight: '500',
};

export default ItemPersonalJoin;
