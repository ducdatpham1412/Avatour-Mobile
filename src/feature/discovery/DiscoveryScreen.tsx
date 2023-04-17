import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_SIZE, LIST_TOPICS} from 'asset';
import Images from 'asset/img/images';
import {safePaddingNotZero} from 'asset/metrics';
import {ItemTour} from 'components';
import {
  SafeView,
  StyleIcon,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {CardInformation} from 'components/common';
import {useTheme} from 'hook';
import {DISCOVERY_ROUTE, ROOT_SCREEN} from 'navigation/config';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {ImageStyle, ScrollView, TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {$styleDropShadow, borderWidthTiny} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {HeaderDiscovery, ItemHotLocation} from './components';

const DiscoveryScreen = () => {
  const theme = useTheme();
  const {banners, hot_locations, favorite_tours} = useAppSelector(
    state => state.logicSlice.resource,
  );

  return (
    <SafeView style={$container}>
      <ScrollView
        contentContainerStyle={$contentContainer}
        showsVerticalScrollIndicator={false}>
        <HeaderDiscovery />

        <StyleTouchable
          customStyle={[
            $buttonSearch,
            {backgroundColor: theme.white, borderColor: theme.gray_300},
          ]}
          onPress={() => navigate(DISCOVERY_ROUTE.searchScreen)}>
          <AntDesign
            name="search1"
            style={[$iconSearch, {color: theme.gray_500}]}
          />
          <StyleText
            i18Text="discovery.searchAround"
            customStyle={[$textSearch, {color: theme.gray_500}]}
          />
        </StyleTouchable>

        <View style={$bannerView}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={$contentBanner}>
            {banners.map(url => (
              <StyleTouchable key={url} customStyle={$itemBannerView}>
                <StyleImage
                  source={{uri: url}}
                  customStyle={$image}
                  defaultSource={Images.images.defaultImage}
                />
              </StyleTouchable>
            ))}
          </ScrollView>
        </View>

        <View
          style={[
            $categoryView,
            $styleDropShadow,
            {backgroundColor: theme.white, shadowColor: theme.gray_600},
          ]}>
          {LIST_TOPICS.map(item => (
            <StyleTouchable
              key={item.id}
              customStyle={$itemCategory}
              onPress={() => {
                navigate(DISCOVERY_ROUTE.searchScreen, {
                  services: item.id,
                });
              }}>
              <StyleIcon
                source={item.icon}
                size={45}
                defaultSource={Images.images.defaultImage}
              />
              <StyleText
                i18Text={item.text}
                customStyle={[$titleCategory, {color: theme.black}]}
              />
            </StyleTouchable>
          ))}
        </View>

        <CardInformation
          title="discovery.favoriteTour"
          containerStyle={$favoriteTourView}
          contentContainerStyle={$listTourView}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={$listTourContent}>
            {favorite_tours.map(tour => (
              <ItemTour
                key={tour.id}
                item={tour}
                containerStyle={$itemTourBox}
              />
            ))}
          </ScrollView>
        </CardInformation>

        <CardInformation
          title="discovery.hotLocation"
          containerStyle={$favoriteTourView}
          overflow="hidden">
          <View style={$locationView}>
            {hot_locations.map((location, index) => (
              <ItemHotLocation
                item={location}
                isLast={index === hot_locations?.length - 1}
              />
            ))}
          </View>
        </CardInformation>
      </ScrollView>
    </SafeView>
  );
};

const $container: ViewStyle = {
  alignItems: 'center',
};
const $contentContainer: ViewStyle = {
  alignItems: 'center',
  paddingBottom: safePaddingNotZero,
};
const $buttonSearch: ViewStyle = {
  width: scale(307),
  height: verticalScale(40),
  marginTop: verticalScale(16),
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: borderWidthTiny,
  borderRadius: 100,
  paddingHorizontal: scale(13),
};
const $iconSearch: TextStyle = {
  fontSize: moderateScale(23),
};
const $textSearch: TextStyle = {
  marginLeft: scale(8),
};
const $bannerView: ViewStyle = {
  width: '100%',
  height: scale(138),
  marginTop: verticalScale(16),
};
const $contentBanner: ViewStyle = {
  paddingRight: scale(12),
};
const $itemBannerView: ViewStyle = {
  width: scale(315),
  height: scale(138),
  marginLeft: scale(12),
};
const $image: ImageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: BORDER_RADIUS.f2,
};
const $categoryView: ViewStyle = {
  width: scale(351),
  paddingVertical: verticalScale(12),
  marginTop: verticalScale(16),
  borderRadius: BORDER_RADIUS.f2,
  flexDirection: 'row',
};
const $itemCategory: ViewStyle = {
  flex: 1,
  alignItems: 'center',
};
const $titleCategory: TextStyle = {
  fontSize: FONT_SIZE.f3,
  marginTop: verticalScale(8),
};
const $favoriteTourView: ViewStyle = {
  marginTop: verticalScale(16),
};
const $titleCard: TextStyle = {
  fontSize: FONT_SIZE.f1,
  fontWeight: 'bold',
  marginLeft: scale(12),
};
const $listTourView: ViewStyle = {
  marginTop: verticalScale(12),
};
const $listTourContent: ViewStyle = {
  paddingLeft: scale(24),
  paddingRight: scale(12),
};
const $locationView: ViewStyle = {
  width: '100%',
  paddingHorizontal: scale(12),
  marginTop: verticalScale(12),
};
const $itemTourBox: ViewStyle = {
  marginRight: scale(8),
};

export default DiscoveryScreen;
