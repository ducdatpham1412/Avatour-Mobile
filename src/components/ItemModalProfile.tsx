import {BORDER_RADIUS, FONT_SIZE} from 'asset';
import Images from 'asset/img/images';
import {useTheme} from 'hook';
import React from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {onGoToProfile} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {StyleIcon, StyleText, StyleTouchable} from './base';
import {Avatar} from './common';

interface Props {
  profile: TypeGetProfileResponse;
  onSelect: () => void;
  onDelete: () => void;
  isChosen: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const ItemModalProfile = ({
  profile,
  onSelect,
  onDelete,
  containerStyle,
  isChosen = false,
}: Props) => {
  const theme = useTheme();

  return (
    <StyleTouchable
      customStyle={[$container, containerStyle]}
      onPress={() =>
        onGoToProfile(profile?.id, {
          initValue: profile,
        })
      }>
      <Avatar source={{uri: profile?.avatar}} size={48} />

      <View style={$body}>
        <StyleText originValue={profile?.name} customStyle={$textName} />
        <View style={$location}>
          <StyleIcon
            source={Images.icons.location}
            size={10}
            customStyle={{tintColor: theme.gray_700}}
          />
          <StyleText
            originValue={profile?.location}
            numberOfLines={1}
            customStyle={[$textLocation, {color: theme.gray_500}]}
          />
        </View>
      </View>

      <StyleTouchable
        customStyle={[
          $buttonSelect,
          {backgroundColor: isChosen ? theme.blue : theme.p_600},
        ]}
        onPress={onSelect}>
        <AntDesign name="plus" style={[$iconPlus, {color: theme.white}]} />
      </StyleTouchable>

      {isChosen && (
        <StyleTouchable
          customStyle={[$buttonClear, {backgroundColor: theme.gray_200}]}
          onPress={onDelete}>
          <AntDesign name="close" style={[$iconDelete, {color: theme.black}]} />
        </StyleTouchable>
      )}
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: '100%',
  paddingHorizontal: scale(8),
  borderRadius: BORDER_RADIUS.f2,
  flexDirection: 'row',
  alignItems: 'center',
};
const $body: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  paddingLeft: scale(8),
  paddingRight: scale(16),
};
const $textName: TextStyle = {
  fontWeight: 'bold',
};
const $location: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
};
const $textLocation: TextStyle = {
  marginLeft: scale(4),
  fontSize: FONT_SIZE.f3,
  marginTop: verticalScale(2),
};
const $buttonSelect: ViewStyle = {
  width: moderateScale(36),
  height: moderateScale(36),
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
};
const $iconPlus: TextStyle = {
  fontWeight: 'bold',
  fontSize: moderateScale(20),
};
const $buttonClear: ViewStyle = {
  width: moderateScale(30),
  height: moderateScale(30),
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: scale(8),
};
const $iconDelete: TextStyle = {
  fontSize: moderateScale(15),
};

export default ItemModalProfile;
