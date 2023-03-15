import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {ScrollView} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {borderWidthTiny} from 'utility/assistant';

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
        styles.container,
        {
          backgroundColor: theme.background,
          borderTopColor: theme.gray_200,
        },
      ]}
      activeOpacity={1}
      onPress={() => onTouchBackground()}>
      <ScrollView keyboardShouldPersistTaps="always">
        <StyleText
          i18Text="discovery.hotLocation"
          customStyle={[styles.textTitle, {color: theme.black}]}
        />
        {hot_locations.map(item => (
          <StyleTouchable
            key={item?.id}
            customStyle={styles.itemSearchBox}
            onPress={() => onSearch(item?.name)}>
            <Ionicons
              name="ios-location-outline"
              style={[styles.iconSearch, {color: theme.gray_500}]}
            />
            <StyleText
              originValue={item?.name}
              customStyle={[styles.textSearch, {color: theme.black}]}
            />
            <AntDesign
              name="search1"
              style={[styles.iconGo, {color: theme.gray_500}]}
            />
          </StyleTouchable>
        ))}
      </ScrollView>
    </StyleTouchable>
  );
};

const styles = ScaledSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    borderTopWidth: borderWidthTiny,
    paddingHorizontal: '20@s',
  },
  textTitle: {
    fontSize: FONT_SIZE.f1,
    fontWeight: 'bold',
    marginTop: '5@vs',
  },
  itemSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '15@vs',
    paddingHorizontal: '15@s',
    paddingBottom: '5@vs',
  },
  iconSearch: {
    fontSize: '17@ms',
  },
  textSearch: {
    fontSize: FONT_SIZE.f2,
    marginLeft: '8@s',
  },
  iconGo: {
    fontSize: '13@ms',
    position: 'absolute',
    right: '15@s',
  },
});

export default SearchSuggestions;
