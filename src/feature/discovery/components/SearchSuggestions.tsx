import {useAppSelector} from 'app-redux/store';
import {horizontalPadding} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {ScrollView, TextStyle, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {borderWidthTiny} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  onTouchBackground(): void;
  onSearch(text: string): void;
}

const SearchSuggestions = (props: Props) => {
  const {onTouchBackground, onSearch} = props;
  const theme = useTheme();
  const {hot_locations} = useAppSelector(state => state.logicSlice.resource);

  return (
    <StyleTouchable
      style={[
        $container,
        {
          backgroundColor: theme.white,
          borderTopColor: theme.gray_200,
        },
      ]}
      activeOpacity={1}
      onPress={() => onTouchBackground()}>
      <ScrollView keyboardShouldPersistTaps="always">
        <StyleText i18Text="discovery.hotLocation" customStyle={$textTitle} />
        {hot_locations.map(item => (
          <StyleTouchable
            key={item?.id}
            customStyle={$itemSearchBox}
            onPress={() => onSearch(item?.name)}>
            <Ionicons
              name="ios-location-outline"
              style={[$iconLocation, {color: theme.gray_500}]}
            />
            <StyleText originValue={item?.name} customStyle={$textSearch} />
            <AntDesign
              name="search1"
              style={[$iconGo, {color: theme.gray_500}]}
            />
          </StyleTouchable>
        ))}
      </ScrollView>
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  borderTopWidth: borderWidthTiny,
  paddingHorizontal: scale(20),
};
const $textTitle: TextStyle = {
  fontSize: FONT_SIZE.f1,
  fontWeight: 'bold',
  marginVertical: verticalScale(8),
};
const $itemSearchBox: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: verticalScale(20),
  paddingHorizontal: horizontalPadding,
};
const $iconLocation: TextStyle = {
  fontSize: moderateScale(18),
};
const $textSearch: TextStyle = {
  marginLeft: scale(8),
};
const $iconGo: TextStyle = {
  fontSize: moderateScale(16),
  position: 'absolute',
  right: scale(16),
};

export default SearchSuggestions;
