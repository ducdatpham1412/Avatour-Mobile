import {apiLikePost, apiUnLikePost} from 'api/profile';
import {updateResource} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM, LIST_TOPICS} from 'asset';
import {REACT} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics, horizontalMargin, horizontalPadding} from 'asset/metrics';
import {ItemTour} from 'components';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import {CardInformation} from 'components/common';
import {useSafeArea, useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {DISCOVERY_ROUTE} from 'navigation/config';
import {checkAuthenticated} from 'navigation/screen/AppModal';
import React from 'react';
import {ScrollView, TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {$styleAllShadow, copyObject} from 'utility/assistant';
import {impactLight} from 'utility/haptic';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {Banner, HeaderDiscovery, ItemHotLocation} from './components';
import FloatingBanners from './screens/FloatingBanners';

const DiscoveryScreen = () => {
  const theme = useTheme();
  const {top, paddingBottom} = useSafeArea();
  const {banners, hot_locations, favorite_tours} = useAppSelector(
    state => state.logicSlice.resource,
  );

  const onReactTour = (tour: Tour) => {
    const onAuthenticated = async () => {
      const currentTours = copyObject(favorite_tours);
      const currentLiked = tour.is_liked;

      try {
        updateResource({
          favorite_tours: currentTours.map(item => {
            if (item.id !== tour.id) {
              return item;
            }
            return {
              ...item,
              is_liked: !currentLiked,
              total_likes: item.total_likes + (currentLiked ? -1 : 1),
            };
          }),
        });
        if (currentLiked) {
          await apiUnLikePost({
            type: REACT.tour,
            reactedId: tour.id,
          });
        } else {
          await apiLikePost({
            type: REACT.tour,
            reactedId: tour.id,
          });
          impactLight();
        }
      } catch (err) {
        updateResource({
          favorite_tours: currentTours,
        });
      }
    };

    checkAuthenticated({
      onAuthenticated,
    });
  };

  return (
    <View style={[$container, {paddingTop: top, backgroundColor: theme.white}]}>
      <ScrollView
        contentContainerStyle={[$contentContainer, {paddingBottom}]}
        showsVerticalScrollIndicator={false}>
        <HeaderDiscovery />

        <StyleTouchable
          customStyle={[$buttonSearch, {borderColor: theme.gray_300}]}
          onPress={() => {
            navigate(DISCOVERY_ROUTE.searchScreen);
          }}>
          <AntDesign
            name="search1"
            style={[$iconSearch, {color: theme.gray_500}]}
          />
          <StyleText
            i18Text="discovery.searchAround"
            customStyle={[$textSearch, {color: theme.gray_500}]}
          />
        </StyleTouchable>

        <Banner
          data={banners.map(value => {
            return {
              url: value,
            };
          })}
        />

        <View
          style={[
            $categoryView,
            $styleAllShadow,
            {
              backgroundColor: theme.white,
              shadowColor: theme.gray_600,
            },
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
          containerStyle={$card}
          contentContainerStyle={$listTourView}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={$listTourContent}>
            {favorite_tours.map(tour => (
              <ItemTour
                key={tour.id}
                item={tour}
                width={scale(270)}
                onReact={() => onReactTour(tour)}
              />
            ))}
          </ScrollView>
        </CardInformation>

        <CardInformation
          title="discovery.hotLocation"
          containerStyle={$card}
          overflow="hidden">
          <View style={$locationView}>
            {hot_locations.map((location, index) => (
              <ItemHotLocation
                key={location.id}
                item={location}
                isLast={index === hot_locations?.length - 1}
              />
            ))}
          </View>
        </CardInformation>
      </ScrollView>

      <FloatingBanners containerStyle={$floatingBanner} />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
  marginTop: verticalScale(4),
};
const $contentContainer: ViewStyle = {
  alignItems: 'center',
  gap: verticalScale(20),
};
const $buttonSearch: ViewStyle = {
  width: scale(335),
  height: verticalScale(40),
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 100,
  paddingHorizontal: scale(13),
  borderWidth: moderateScale(1),
};
const $iconSearch: TextStyle = {
  fontSize: moderateScale(23),
};
const $textSearch: TextStyle = {
  marginLeft: scale(8),
};
const $categoryView: ViewStyle = {
  width: Metrics.width - 2 * horizontalPadding,
  paddingVertical: verticalScale(12),
  borderRadius: BORDER_RADIUS.f2,
  flexDirection: 'row',
};
const $itemCategory: ViewStyle = {
  flex: 1,
  alignItems: 'center',
};
const $titleCategory: TextStyle = {
  fontSize: FONT_SIZE.f4,
  fontWeight: FONT_WEIGHT_MEDIUM,
  marginTop: verticalScale(8),
};
const $listTourView: ViewStyle = {
  marginTop: verticalScale(12),
};
const $listTourContent: ViewStyle = {
  paddingLeft: horizontalPadding,
  paddingRight: horizontalPadding,
  gap: horizontalMargin,
};
const $locationView: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(12),
};
const $card: ViewStyle = {
  marginTop: verticalScale(16),
};
const $floatingBanner: ViewStyle = {
  position: 'absolute',
  bottom: verticalScale(16),
};

export default DiscoveryScreen;
