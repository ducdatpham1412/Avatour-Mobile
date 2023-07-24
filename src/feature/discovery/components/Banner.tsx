import {BORDER_RADIUS} from 'asset';
import Images from 'asset/img/images';
import {StyleImage, StyleTouchable} from 'components/base';
import {navigate} from 'navigation/NavigationService';
import {DISCOVERY_ROUTE} from 'navigation/config';
import React from 'react';
import {ImageStyle, StyleProp, View, ViewStyle} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {scale} from 'utility/scale';

type ItemBanner = {
  url: string;
};

interface Props {
  data: ItemBanner[];
  containerStyle?: StyleProp<ViewStyle>;
}

const Banner = ({data, containerStyle}: Props) => {
  return (
    <View style={[$container, containerStyle]}>
      <Carousel
        width={scale(351)}
        height={scale(150)}
        data={data}
        renderItem={({item}) => {
          return (
            <StyleTouchable
              key={item.url}
              customStyle={$itemBannerView}
              onPress={() => navigate(DISCOVERY_ROUTE.searchScreen)}>
              <StyleImage
                source={{uri: item.url}}
                customStyle={$image}
                defaultSource={Images.images.defaultImage}
              />
            </StyleTouchable>
          );
        }}
        style={$contentBanner}
        loop
        autoPlay
        scrollAnimationDuration={700}
        autoPlayInterval={3000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingOffset: 40,
          parallaxScrollingScale: 0.96,
          parallaxAdjacentItemScale: 0.86,
        }}
      />
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
  height: scale(150),
};
const $contentBanner: ViewStyle = {
  alignSelf: 'center',
};
const $itemBannerView: ViewStyle = {
  width: scale(335),
  height: scale(150),
  marginHorizontal: scale(8),
};
const $image: ImageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: BORDER_RADIUS.f2,
};

export default Banner;
