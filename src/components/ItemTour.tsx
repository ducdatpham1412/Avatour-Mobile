import {BORDER_RADIUS, FONT_SIZE, ratioImageTour} from 'asset';
import Images from 'asset/img/images';
import Theme from 'asset/theme/Theme';
import {useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {
  ImageBackground,
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {formatLocaleNumber} from 'utility/format';
import {moderateScale, scale} from 'utility/scale';
import {StyleIcon, StyleImage, StyleText, StyleTouchable} from './base';

interface Props {
  item: Tour;
  containerStyle?: StyleProp<ViewStyle>;
}

const ItemTour = ({item, containerStyle}: Props) => {
  const theme = useTheme();
  const listImages: Array<string> = [];
  item?.schedule?.forEach(item => listImages.push(...item));
  const addOn = listImages.length - 4;

  return (
    <ImageBackground
      style={[$container, containerStyle]}
      source={{uri: listImages?.[0]}}>
      <LinearGradient
        colors={[Theme.newTheme.black, 'transparent']}
        style={$gradient}
        angle={180}
        start={{x: 0.5, y: 1}}
        end={{x: 0.5, y: 0}}
      />

      <StyleTouchable
        customStyle={$body}
        onPress={() =>
          push(ROOT_SCREEN.detailTour, {
            tour: item,
          })
        }>
        <View style={$scheduleView}>
          <View
            style={[$scheduleBox, {backgroundColor: theme.white_opacity(0.2)}]}>
            {listImages.slice(0, 5).map((image, index) => (
              <View style={$itemLocationView} key={index}>
                <StyleImage
                  source={{uri: image}}
                  defaultSource={Images.images.defaultImage}
                  style={$imageLocation}
                />
                {index === 4 && addOn > 0 && (
                  <View
                    style={[
                      $addOnBox,
                      {backgroundColor: theme.black_opacity(0.5)},
                    ]}>
                    <StyleText
                      originValue={`+${addOn}`}
                      customStyle={{color: theme.white}}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={$infoView}>
          <StyleText
            originValue={formatLocaleNumber(
              String(item?.start_price / item?.number_people),
            )}
            customStyle={[$textInfo, {color: theme.white, fontWeight: 'bold'}]}
            numberOfLines={1}>
            <StyleText
              i18Text="discovery.pricePeople"
              i18Params={{
                value: item?.number_people,
              }}
              customStyle={[
                $textInfo,
                {color: theme.white, fontWeight: 'normal'},
              ]}
            />
          </StyleText>
        </View>

        <View style={$infoView}>
          <StyleIcon
            source={Images.icons.location}
            size={10}
            customStyle={$iconLocation}
          />
          <StyleText
            originValue={item?.location}
            customStyle={[$textInfo, {color: theme.white}]}
            numberOfLines={1}
          />
        </View>

        <View style={$infoView}>
          <StyleIcon
            source={{uri: item?.creator_avatar}}
            size={20}
            customStyle={$iconAvatar}
          />
          <StyleText
            originValue={item?.creator_name}
            customStyle={[$textInfo, {color: theme.white}]}
            numberOfLines={1}
          />
        </View>
      </StyleTouchable>
    </ImageBackground>
  );
};

const $container: ViewStyle = {
  width: scale(351),
  height: scale(351) * ratioImageTour,
  borderRadius: BORDER_RADIUS.f2,
  overflow: 'hidden',
};
const $gradient: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
};
const $body: ViewStyle = {
  flex: 1,
  padding: scale(8),
  flexDirection: 'column-reverse',
};
const $scheduleView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
};
const $scheduleBox: ViewStyle = {
  flexDirection: 'row',
  paddingLeft: scale(5),
  paddingVertical: scale(5),
  borderRadius: moderateScale(10),
};
const $itemLocationView: ViewStyle = {
  width: scale(30),
  height: scale(30),
  marginRight: scale(5),
};
const $imageLocation: ImageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: moderateScale(10),
};
const $addOnBox: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: moderateScale(10),
  alignItems: 'center',
  justifyContent: 'center',
};
const $infoView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: scale(5),
};
const $textInfo: TextStyle = {
  fontSize: FONT_SIZE.f3,
};
const $iconLocation: ImageStyle = {
  marginRight: scale(4),
};
const $iconAvatar: ImageStyle = {
  borderRadius: 50,
  marginRight: scale(4),
};

export default memo(ItemTour, (pre: Props, next: Props) => {
  if (!isEqual(pre.item, next.item)) {
    return false;
  }
  if (__DEV__ && !isEqual(pre.containerStyle, next.containerStyle)) {
    return false;
  }
  return true;
});
