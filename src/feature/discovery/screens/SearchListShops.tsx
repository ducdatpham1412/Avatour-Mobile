import {apiSearch} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import {IconShop, IconTour} from 'asset/icons';
import {
  Metrics,
  horizontalMargin,
  horizontalPadding,
  verticalMargin,
} from 'asset/metrics';
import {StyleText} from 'components/base';
import {usePaging, useTheme} from 'hook';
import React, {useEffect} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ItemShop} from '../components';

const SearchListShops = () => {
  const theme = useTheme();
  const {searchParams} = useAppSelector(state => state.logicSlice);
  const {list, setParams} = usePaging<
    TypeGetProfileResponse,
    TypeSearchRequest
  >({
    request: apiSearch,
    params: {
      ...searchParams,
      post_search: 'shop',
    },
    isInitNotRunRequest: true,
  });

  useEffect(() => {
    setParams({
      ...searchParams,
      post_search: 'shop',
    });
  }, [searchParams]);

  return (
    <View style={$container}>
      <View style={$headerShop}>
        <IconShop tintColor={theme.green} />
        <StyleText i18Text="tour.restaurantHotel" customStyle={$textHeader} />
      </View>

      <ScrollView
        horizontal
        style={$scroll}
        contentContainerStyle={$contentScroll}
        showsHorizontalScrollIndicator={false}>
        {list.map((item, index) => {
          return (
            <ItemShop
              item={item}
              key={item.id}
              containerStyle={{
                marginRight: index < list.length - 1 ? horizontalMargin : 0,
              }}
            />
          );
        })}
      </ScrollView>

      <View style={[$indicator, {borderTopColor: theme.gray_300}]} />

      <View style={$headerShop}>
        <IconTour tintColor={theme.green} />
        <StyleText i18Text="tour.tourTravel" customStyle={$textHeader} />
      </View>
    </View>
  );
};

const $container: ViewStyle = {
  width: Metrics.width,
  left: -horizontalPadding,
  marginTop: verticalMargin - verticalScale(8),
};
const $headerShop: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: horizontalPadding,
};
const $textHeader: TextStyle = {
  fontWeight: 'bold',
  marginLeft: scale(4),
};
const $scroll: ViewStyle = {
  marginTop: verticalMargin,
};
const $contentScroll: ViewStyle = {
  paddingHorizontal: horizontalPadding,
};
const $indicator: ViewStyle = {
  width: scale(343),
  borderTopWidth: moderateScale(0.5),
  alignSelf: 'center',
  marginVertical: verticalMargin,
};

export default SearchListShops;
