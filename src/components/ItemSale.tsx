import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {STATUS} from 'asset/enum';
import Images from 'asset/img/images';
import {useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {$styleDropShadow} from 'utility/assistant';
import {formatLocaleNumber, formatMoney} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {StyleIcon, StyleImage, StyleText, StyleTouchable} from './base';
import {Avatar, IconLiked, IconNotLiked} from './common';

interface Props {
  item: TypeGroupBuying;
  onReact: (params: TypeParamsLikePost) => Promise<void>;
  containerStyle?: StyleProp<ViewStyle>;
  hidingElements?: Array<'name' | 'location' | 'status'>;
}

interface StatusProps {
  status: number;
}

const Status = ({status}: StatusProps) => {
  const theme = useTheme();
  let textStatus: I18Normalize = 'discovery.available';
  let color = theme.blue;

  if (status === STATUS.temporarilyClose) {
    textStatus = 'discovery.temporarilyClosed';
    color = theme.red;
  }

  return (
    <View style={$informationView}>
      <StyleIcon source={Images.icons.calendar} size={10} />
      <StyleText i18Text={textStatus} customStyle={[$textInfo, {color}]} />
    </View>
  );
};

const ItemSale = ({item, onReact, containerStyle, hidingElements}: Props) => {
  const theme = useTheme();

  const startPrice = item?.prices?.[item?.prices?.length - 1]?.price;
  const endPrice = item?.prices?.[0]?.price;

  let textPrice = '';
  if (startPrice && endPrice) {
    textPrice = `${startPrice} - ${formatMoney(endPrice)}`;
  } else {
    const temp = startPrice ?? endPrice ?? '0';
    textPrice = `${formatLocaleNumber(temp)}vnd`;
  }

  const renderJoins = () => {
    if (!item.total_members) {
      return (
        <StyleText
          i18Text="discovery.beTheFirstJoin"
          customStyle={[$textInfo, {color: theme.gray_500, marginLeft: 0}]}
        />
      );
    }
    return (
      <>
        {[Images.images.avatar01, Images.images.avatar03].map(
          (source, index) => {
            return <Avatar key={index} source={source} size={15} />;
          },
        )}
        <StyleText
          i18Text="discovery.numberJoins"
          i18Params={{
            value: item?.total_members,
          }}
          customStyle={[$textInfo, {color: theme.gray_500}]}
        />
      </>
    );
  };

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
          saleId: item.id,
        })
      }>
      <View style={$imageView}>
        <StyleImage
          source={{uri: item?.images?.[0]}}
          defaultImageSource="image"
          customStyle={$image}
        />
        <View style={[$heartBox, {backgroundColor: theme.white_opacity(0.8)}]}>
          {item?.is_liked ? (
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

      {!hidingElements?.includes('name') && !!item.name && (
        <View style={$informationView}>
          <StyleText
            originValue={item?.name}
            customStyle={$textName}
            numberOfLines={1}
          />
        </View>
      )}

      {!hidingElements?.includes('location') && !!item.creator_location && (
        <View style={$informationView}>
          <StyleIcon
            source={Images.icons.location}
            size={10}
            customStyle={{tintColor: theme.gray_500}}
          />
          <StyleText
            originValue={item?.creator_location}
            customStyle={[$textInfo, {color: theme.gray_500}]}
            numberOfLines={1}
          />
        </View>
      )}

      <View style={$informationView}>{renderJoins()}</View>

      <View style={$informationView}>
        <StyleText
          originValue={textPrice}
          customStyle={[$textPrice, {color: theme.p_800}]}
        />
      </View>

      {!hidingElements?.includes('status') &&
        item.status === STATUS.temporarilyClose && (
          <Status status={item.status} />
        )}
    </StyleTouchable>
  );
};

const defaultWidth = scale(163.5);
const $container: ViewStyle = {
  width: defaultWidth,
  paddingBottom: scale(8),
};
const $imageView: ViewStyle = {
  width: defaultWidth,
  height: defaultWidth,
  overflow: 'hidden',
  borderRadius: BORDER_RADIUS.f3,
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
  width: defaultWidth - scale(8),
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(4),
  overflow: 'hidden',
  paddingHorizontal: scale(2),
};
const $textName: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $textInfo: TextStyle = {
  marginLeft: scale(4),
  fontSize: FONT_SIZE.f4,
};
const $textPrice: TextStyle = {
  fontWeight: 'bold',
  fontSize: FONT_SIZE.f3,
};

export default memo(ItemSale, (pre: Props, next: Props) => {
  if (!isEqual(pre.item, next.item)) {
    return false;
  }
  return true;
});
