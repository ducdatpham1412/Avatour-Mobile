import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_SIZE, ratioImageSale} from 'asset';
import {GROUP_BUYING_STATUS} from 'asset/enum';
import {
  StyleIcon,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import React, {memo, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {borderWidthTiny, detectFromStyle} from 'utility/assistant';
import {formatDDMMMMYY, formatMoney} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';

interface Props {
  item: TypeJoinPersonalAndSale;
  containerStyle?: StyleProp<ViewStyle>;
  contentFontSize?: number;
}

const ItemJoinProfile = ({item, containerStyle, contentFontSize}: Props) => {
  const theme = useTheme();
  const {profile} = useAppSelector(state => state.accountSlice.passport);
  const width = useRef(
    detectFromStyle(containerStyle, 'width') || defaultWidth,
  );
  const fontSize = useRef(contentFontSize || FONT_SIZE.f4);
  const [height, setHeight] = useState(
    typeof width.current === 'number' ? width.current * ratioImageSale : 0,
  );

  return (
    <StyleTouchable
      customStyle={[
        $container,
        {backgroundColor: theme.white, borderColor: theme.gray_300},
        containerStyle,
        {width: width.current},
      ]}
      onPress={() =>
        push(ROOT_SCREEN.detailMeJoin, {
          saleId: item?.sale_id,
          joinPersonal: {
            id: item.id,
            group_id: item.group_id,
            sale_id: item.sale_id,
            deposit: item.deposit,
            price: item.price,
            amount: item.amount,
            time_will_buy: item.time_will_buy,
            note: item.note,
            creator: profile.id,
            creator_name: profile.name,
            creator_avatar: profile.avatar,
            created: item.created,
            status: item.status,
          },
          mode: 'see-detail',
        })
      }
      onLayout={({nativeEvent}) => {
        if (typeof width.current === 'string') {
          setHeight(nativeEvent.layout.width * ratioImageSale);
        }
      }}>
      <StyleImage
        source={{uri: item?.sale?.images?.[0]}}
        customStyle={{width: width.current, height}}
        defaultImageSource="image"
      />

      <View style={$informationView}>
        <StyleIcon source={{uri: item?.sale?.avatar}} size={17} />
        <StyleText
          originValue={item?.sale?.name}
          customStyle={$textName}
          numberOfLines={1}
        />
      </View>

      <View style={$informationView}>
        <StyleText
          i18Text="discovery.arrivalTime"
          customStyle={[
            $textTitle,
            {color: theme.gray_600, fontSize: fontSize.current},
          ]}
        />
        <StyleText
          originValue={formatDDMMMMYY(item?.time_will_buy)}
          customStyle={[$textInfo, {fontSize: fontSize.current}]}
          numberOfLines={1}
        />
      </View>

      <View style={$informationView}>
        <StyleText
          i18Text="discovery.deposit"
          customStyle={[
            $textTitle,
            {color: theme.gray_600, fontSize: fontSize.current},
          ]}
        />
        <StyleText
          originValue={formatMoney(item?.deposit)}
          customStyle={[
            $textInfo,
            {color: theme.blue, fontSize: fontSize.current},
          ]}
          numberOfLines={1}
        />
      </View>

      {item?.status === GROUP_BUYING_STATUS.requestBought && (
        <View style={$informationView}>
          <StyleText
            i18Text="profile.waitingConfirm"
            customStyle={[
              $textTitle,
              {
                color: theme.red,
                fontSize: fontSize.current,
                fontWeight: 'bold',
              },
            ]}
          />
        </View>
      )}
    </StyleTouchable>
  );
};

const defaultWidth = scale(172);
const $container: ViewStyle = {
  borderRadius: BORDER_RADIUS.f3,
  paddingBottom: scale(8),
  borderWidth: borderWidthTiny,
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
const $textTitle: TextStyle = {
  fontSize: FONT_SIZE.f4,
};
const $textInfo: TextStyle = {
  fontSize: FONT_SIZE.f4,
  fontWeight: 'bold',
  marginLeft: scale(4),
};

export default memo(ItemJoinProfile, (pre: Props, next: Props) => {
  if (!isEqual(pre.item, next.item)) {
    return false;
  }
  return true;
});
