import {BORDER_RADIUS, FONT_SIZE, ratioImageSale} from 'asset';
import Images from 'asset/img/images';
import {useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {
  $styleDropShadow,
  borderWidthTiny,
  renderPersonalJoinsFromGroups,
} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {StyleIcon, StyleImage, StyleText, StyleTouchable} from './base';
import {IconLiked, IconNotLiked} from './common';

interface Props {
  item: TypeGroupBuying;
  onReact: (params: TypeParamsLikePost) => Promise<void>;
  containerStyle?: StyleProp<ViewStyle>;
  hidingElements?: Array<'name' | 'location'>;
}

const ItemSale = ({item, onReact, containerStyle, hidingElements}: Props) => {
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

  const listPersonalJoins = renderPersonalJoinsFromGroups(item?.groups, {
    maxNumber: 3,
  });

  let RenderPeopleJoined = null;
  if (!listPersonalJoins.length) {
    RenderPeopleJoined = (
      <>
        <StyleIcon source={Images.images.defaultAvatar} size={15} />
        <StyleIcon source={Images.images.defaultAvatar} size={15} />
        <StyleIcon source={Images.images.defaultAvatar} size={15} />
        <StyleText
          i18Text="discovery.beTheFirstJoin"
          customStyle={[$textInfo, {color: theme.gray_500}]}
        />
      </>
    );
  } else {
    RenderPeopleJoined = (
      <>
        {listPersonalJoins.map((personal, index) => {
          return (
            <StyleIcon
              key={index}
              source={{uri: personal?.creator_avatar}}
              size={15}
            />
          );
        })}
        <StyleText
          i18Text="discovery.numberGroupJoined"
          i18Params={{
            value: item?.total_members,
          }}
          customStyle={[$textInfo, {color: theme.gray_500}]}
        />
      </>
    );
  }

  return (
    <StyleTouchable
      customStyle={[
        $container,
        $styleDropShadow,
        {backgroundColor: theme.white, borderColor: theme.gray_300},
        containerStyle,
      ]}
      onPress={() =>
        push(ROOT_SCREEN.detailSale, {
          sale: item,
        })
      }>
      <View style={$imageView}>
        <StyleImage
          source={{uri: item?.images?.[0]}}
          defaultImageSource="image"
          customStyle={$image}
        />
        <View style={[$heartBox, {backgroundColor: theme.white_opacity(0.8)}]}>
          {!!item?.is_liked ? (
            <IconLiked
              customStyle={$iconLike}
              onPress={() =>
                onReact({postId: item?.id, isLiked: item?.is_liked})
              }
            />
          ) : (
            <IconNotLiked
              customStyle={$iconLike}
              onPress={() =>
                onReact({postId: item?.id, isLiked: item?.is_liked})
              }
            />
          )}
        </View>
      </View>

      {!hidingElements?.includes('name') && (
        <View style={$informationView}>
          <StyleIcon source={{uri: item?.creator_avatar}} size={17} />
          <StyleText originValue={item?.creator_name} customStyle={$textName} />
        </View>
      )}

      {!hidingElements?.includes('location') && (
        <View style={$informationView}>
          <StyleIcon
            source={Images.icons.location}
            size={10}
            customStyle={{tintColor: theme.gray_500}}
          />
          <StyleText
            originValue={item?.creator_location}
            customStyle={[$textInfo, {color: theme.gray_500}]}
          />
        </View>
      )}

      <View style={$informationView}>{RenderPeopleJoined}</View>

      <View style={$informationView}>
        <StyleText
          originValue={textPrice}
          customStyle={[$textPrice, {color: theme.red}]}
        />
      </View>
    </StyleTouchable>
  );
};

const defaultWidth = scale(172);
const $container: ViewStyle = {
  width: defaultWidth,
  paddingBottom: scale(8),
  borderRadius: BORDER_RADIUS.f4,
  marginTop: scale(7),
  borderWidth: borderWidthTiny,
};
const $imageView: ViewStyle = {
  width: defaultWidth,
  height: defaultWidth * ratioImageSale,
  overflow: 'hidden',
};
const $image: ImageStyle = {
  width: '100%',
  height: '100%',
};
const $heartBox: ViewStyle = {
  position: 'absolute',
  width: moderateScale(30),
  height: moderateScale(30),
  alignItems: 'center',
  justifyContent: 'center',
  right: scale(8),
  top: scale(8),
  borderRadius: 100,
};
const $iconLike: TextStyle = {
  fontSize: moderateScale(20),
};
const $informationView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(4),
  paddingHorizontal: scale(4),
};
const $textName: TextStyle = {
  marginLeft: scale(8),
  fontWeight: 'bold',
};
const $textInfo: TextStyle = {
  marginLeft: scale(4),
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
