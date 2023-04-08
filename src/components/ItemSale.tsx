import {View, Text, ViewStyle, ImageStyle, TextStyle} from 'react-native';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {useTheme} from 'hook';
import {Metrics} from 'asset/metrics';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {BORDER_RADIUS, FONT_SIZE, ratioImageSale} from 'asset';
import {StyleIcon, StyleImage, StyleText, StyleTouchable} from './base';
import Images from 'asset/img/images';
import {$styleDropShadow} from 'utility/assistant';

interface Props {
  item: TypeGroupBuying;
  onReact: (params: TypeParamsLikePost) => Promise<void>;
}

const ItemSale = ({item, onReact}: Props) => {
  const theme = useTheme();

  const startPrice = item?.prices?.[item?.prices?.length - 1]?.price;
  const endPrice = item?.prices?.[0]?.price;

  let textPrice = '';
  if (startPrice && endPrice) {
    textPrice = `${startPrice} - ${endPrice}vnd`;
  } else {
    const temp = startPrice ?? endPrice ?? '0';
    textPrice = `${temp}vnd`;
  }

  const avatarJoined: string[] = [];
  item?.groups?.every?.(group => {
    if (avatarJoined.length > 3) {
      return false;
    }
    group?.members?.forEach?.(mem => {
      if (avatarJoined.length > 3) {
        return false;
      }
      avatarJoined.push(mem?.creator_avatar);
    });
  });

  let RenderPeopleJoined = null;
  if (!avatarJoined.length) {
    RenderPeopleJoined = (
      <>
        <StyleIcon source={Images.images.defaultAvatar} size={20} />
        <StyleIcon
          source={Images.images.defaultAvatar}
          size={20}
          customStyle={{left: -scale(5)}}
        />
        <StyleIcon
          source={Images.images.defaultAvatar}
          size={20}
          customStyle={{left: -scale(10)}}
        />
        <StyleText
          i18Text="discovery.beTheFirstJoin"
          customStyle={[
            $textInfo,
            {color: theme.gray_500, marginLeft: -scale(2)},
          ]}
        />
      </>
    );
  } else {
    RenderPeopleJoined = (
      <>
        {avatarJoined.map((avatar, index) => {
          let marginLeft = 0;
          if (index === 1) {
            marginLeft = -scale(5);
          } else if (index === 2) {
            marginLeft = -scale(10);
          }
          return (
            <StyleIcon
              key={index}
              source={{uri: avatar}}
              size={20}
              customStyle={{left: marginLeft}}
            />
          );
        })}
        <StyleText
          i18Text="discovery.beTheFirstJoin"
          customStyle={[
            $textInfo,
            {color: theme.gray_500, marginLeft: -scale(2)},
          ]}
        />
      </>
    );
  }

  return (
    <View
      style={[$container, $styleDropShadow, {backgroundColor: theme.white}]}>
      <View style={$imageView}>
        <StyleImage
          source={{uri: item?.images?.[0]}}
          defaultImageSource="image"
          customStyle={$image}
        />
        <StyleTouchable
          customStyle={[$heartBox, {backgroundColor: theme.white}]}
          onPress={() => onReact({postId: item?.id, isLiked: item?.is_liked})}>
          <StyleIcon
            source={
              !!item?.is_liked ? Images.icons.heartFocus : Images.icons.heart
            }
            size={32}
            customStyle={{
              tintColor: item?.is_liked ? theme.pink : theme.black,
            }}
          />
        </StyleTouchable>
      </View>

      <View style={[$informationView, {marginTop: verticalScale(12)}]}>
        <StyleIcon source={{uri: item?.creator_avatar}} size={25} />
        <StyleText originValue={item?.creator_name} customStyle={$textName} />
      </View>

      <View style={$informationView}>
        <StyleIcon
          source={Images.icons.location}
          size={15}
          customStyle={{tintColor: theme.gray_500}}
        />
        <StyleText
          originValue={item?.creator_location}
          customStyle={[$textInfo, {color: theme.gray_500}]}
        />
      </View>

      <View style={$informationView}>
        {RenderPeopleJoined}
        <StyleText
          originValue={item?.creator_location}
          customStyle={[$textInfo, {color: theme.gray_500}]}
        />
      </View>

      <View style={$informationView}>
        <StyleText
          originValue={textPrice}
          customStyle={[$textPrice, {color: theme.red}]}
        />
      </View>
    </View>
  );
};

const $container: ViewStyle = {
  width: Metrics.width - scale(24),
  padding: scale(12),
  borderRadius: BORDER_RADIUS.f2,
  marginBottom: verticalScale(12),
};
const imageWidth = Metrics.width - scale(24) - scale(24);
const $imageView: ViewStyle = {
  width: imageWidth,
  height: imageWidth * ratioImageSale,
  borderRadius: BORDER_RADIUS.f2,
  overflow: 'hidden',
};
const $image: ImageStyle = {
  width: '100%',
  height: '100%',
};
const $heartBox: ViewStyle = {
  position: 'absolute',
  width: moderateScale(38),
  height: moderateScale(38),
  alignItems: 'center',
  justifyContent: 'center',
  right: scale(12),
  top: scale(12),
  borderRadius: 100,
};
const $informationView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(4),
};
const $textName: TextStyle = {
  marginLeft: scale(8),
  fontWeight: 'bold',
};
const $textInfo: TextStyle = {
  marginLeft: scale(8),
  fontSize: FONT_SIZE.f3,
};
const $textPrice: TextStyle = {
  fontWeight: 'bold',
};

export default memo(ItemSale, (pre: Props, next: Props) => {
  if (!isEqual(pre.item, next.item)) {
    return false;
  }
  return true;
});
