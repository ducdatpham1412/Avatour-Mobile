import {BORDER_RADIUS, FONT_SIZE, ratioImageTour} from 'asset';
import {useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {formatLocaleNumber, formatMoney} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';
import {StyleImage, StyleText, StyleTouchable} from './base';
import {Avatar} from './common';
import BoxReact from './BoxReact';
import {IconTagStars} from 'asset/icons';
import {STATUS} from 'asset/enum';
import {ToolTip} from 'navigation/screen/modals';

interface Props {
  item: Tour;
  containerStyle?: StyleProp<ViewStyle>;
  width?: number;
  fontSize?: number;
  onReact?: () => void;
}

const ItemTour = ({
  item,
  containerStyle,
  width = scale(343),
  fontSize = FONT_SIZE.f2,
  onReact,
}: Props) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const listImages: string[] = item.schedule?.reduce((pre, current) => {
    return pre.concat(...current);
  }, []);
  const textPeople = (
    item.number_people > 1 ? t('discovery.people') : t('discovery.person')
  ).toLocaleLowerCase();

  return (
    <StyleTouchable
      customStyle={[$container, containerStyle, {width}]}
      onPress={() => {
        push(ROOT_SCREEN.detailTour, {
          tourId: item.id,
        });
      }}>
      <View style={{width, height: width * ratioImageTour}}>
        <StyleImage
          source={{uri: listImages?.[0]}}
          customStyle={$image}
          defaultImageSource="image"
        />
        <BoxReact isReacted={item.is_liked} onPress={onReact} />
      </View>
      <View style={$body}>
        <View style={$content}>
          {!!item.name && (
            <StyleText
              originValue={item?.name}
              customStyle={[$name, {fontSize}]}
              numberOfLines={2}
            />
          )}
          <StyleText
            originValue={`<b>${formatLocaleNumber(
              item.start_price,
            )} - ${formatMoney(item.end_price)}</b> | ${
              item.number_people
            } ${textPeople}`}
            mode="html"
            htmlTextBoldColor={theme.p_800}
            customStyle={[$price, {fontSize}]}
          />
          <View style={$creator}>
            <Avatar
              source={{uri: item.creator_avatar}}
              size={(20 / 16) * fontSize}
            />
            <StyleText
              originValue={item.creator_name}
              customStyle={[$nameCreator, {fontSize}]}
              numberOfLines={1}
            />
          </View>
        </View>

        {item?.status === STATUS.draft && (
          <StyleTouchable
            customStyle={$buttonTag}
            onPress={() => {
              ToolTip.show({
                content: t('tour.tourIsPrivate'),
                button: {
                  title: 'discovery.shareToCommunity',
                  onPress: () => {
                    push(ROOT_SCREEN.detailTour, {
                      tourId: item.id,
                    });
                  },
                },
              });
            }}>
            <IconTagStars tintColor={theme.blue} />
          </StyleTouchable>
        )}
      </View>
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: scale(343),
  overflow: 'hidden',
};
const $body: ViewStyle = {
  width: '100%',
  paddingHorizontal: scale(2),
  flexDirection: 'row',
};
const $content: ViewStyle = {
  flex: 1,
  paddingRight: scale(8),
};
const $image: ImageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: BORDER_RADIUS.f2,
};
const $name: TextStyle = {
  marginTop: verticalScale(4),
  fontWeight: 'bold',
};
const $price: TextStyle = {
  marginTop: verticalScale(4),
};
const $creator: ViewStyle = {
  marginTop: verticalScale(4),
  flexDirection: 'row',
  alignItems: 'center',
};
const $nameCreator: TextStyle = {
  marginLeft: scale(4),
};
const $buttonTag: ViewStyle = {
  marginTop: verticalScale(4),
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
