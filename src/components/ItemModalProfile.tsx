import {BORDER_RADIUS, FONT_WEIGHT_MEDIUM} from 'asset';
import Images from 'asset/img/images';
import {useTheme} from 'hook';
import React from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {onGoToProfile} from 'utility/assistant';
import {scale, verticalScale} from 'utility/scale';
import {StyleIcon, StyleText, StyleTouchable} from './base';
import {Avatar} from './common';

interface Props {
  profile: TypeGetProfileResponse;
  onSelect: () => void;
}

const ItemModalProfile = ({profile, onSelect}: Props) => {
  const theme = useTheme();

  return (
    <StyleTouchable
      customStyle={[$container, {backgroundColor: theme.background}]}
      //   onPress={() => ModalProfile.show({userId: profile?.id})}
      onPress={() => onGoToProfile(profile?.id)}>
      <Avatar source={{uri: profile?.avatar}} size={40} />

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
            customStyle={[$textLocation, {color: theme.gray_700}]}
          />
        </View>
      </View>

      <StyleTouchable
        customStyle={[$buttonSelect, {backgroundColor: theme.blue}]}
        onPress={onSelect}>
        <StyleText
          i18Text="common.imageUpload.selected"
          customStyle={[$textSelect, {color: theme.white}]}
        />
      </StyleTouchable>
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: '100%',
  padding: scale(8),
  marginTop: verticalScale(8),
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
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $location: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
};
const $textLocation: TextStyle = {
  marginLeft: scale(4),
};
const $buttonSelect: ViewStyle = {
  paddingHorizontal: scale(10),
  paddingVertical: verticalScale(2),
  borderRadius: 30,
};
const $textSelect: TextStyle = {
  fontWeight: 'bold',
};

export default ItemModalProfile;
