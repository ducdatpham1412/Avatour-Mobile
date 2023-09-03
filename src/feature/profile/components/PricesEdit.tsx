import {BORDER_RADIUS, FONT_SIZE} from 'asset';
import {IconClose, IconEdit} from 'asset/icons';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React, {ElementRef, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {formatMoney} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalAddPrice, TypeChangePrice} from '../post';

interface Props {
  prices: TypePrice[];
  enableEdit?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  onAddPrice?: (value: TypePrice) => void;
  onDeletePrice?: (value: TypePrice) => void;
  onEditPrice?: (value: TypeChangePrice) => void;
}

const PricesEdit = ({
  prices,
  enableEdit = false,
  containerStyle,
  onAddPrice,
  onDeletePrice,
  onEditPrice,
}: Props) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const modalPriceRef = useRef<ElementRef<typeof ModalAddPrice>>(null);

  return (
    <>
      <View style={[$container, containerStyle]}>
        {prices.map((price, index) => {
          return (
            <View
              key={price.number_people}
              style={[$priceBox, {backgroundColor: theme.p_100}]}>
              <View style={$infoPrice}>
                <StyleText
                  originValue={`${t('discovery.amount')}: ${
                    price.number_people
                  }`}
                />
                <StyleText
                  originValue={formatMoney(price.price)}
                  customStyle={$textPrice}
                />
              </View>
              {enableEdit && (
                <>
                  <StyleTouchable
                    customStyle={$editBox}
                    onPress={() => {
                      modalPriceRef.current?.show({
                        numberPeople: price.number_people,
                        price: price.price,
                        indexEdit: index,
                      });
                    }}>
                    <IconEdit tintColor={theme.gray_600} />
                  </StyleTouchable>
                  {price.number_people === 1 ? (
                    <View style={$deleteBox} />
                  ) : (
                    <StyleTouchable
                      customStyle={$deleteBox}
                      onPress={() => onDeletePrice?.(price)}>
                      <IconClose tintColor={theme.gray_600} />
                    </StyleTouchable>
                  )}
                </>
              )}
            </View>
          );
        })}
        {enableEdit && (
          <StyleTouchable
            customStyle={[$buttonAdd, {borderColor: theme.p_600}]}
            onPress={() => modalPriceRef.current?.show()}>
            <AntDesign name="plus" style={[$icon, {color: theme.black}]} />
            <StyleText i18Text="profile.addPrice" customStyle={$textAddPrice} />
          </StyleTouchable>
        )}
      </View>

      <ModalAddPrice
        ref={modalPriceRef}
        prices={prices}
        onAddPrice={value => onAddPrice?.(value)}
        onChangePrice={e => onEditPrice?.(e)}
      />
    </>
  );
};

const $container: ViewStyle = {
  width: '100%',
};
const $priceBox: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(8),
  paddingHorizontal: scale(16),
  paddingVertical: verticalScale(8),
  borderRadius: BORDER_RADIUS.f4,
};
const $infoPrice: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
};
const $textPrice: TextStyle = {
  marginTop: verticalScale(2),
  fontWeight: 'bold',
};
const $editBox: ViewStyle = {
  width: moderateScale(40),
  alignItems: 'center',
  justifyContent: 'center',
};
const $deleteBox: ViewStyle = {
  width: moderateScale(40),
  alignItems: 'center',
  justifyContent: 'center',
};
const $buttonAdd: ViewStyle = {
  width: '100%',
  height: moderateScale(40),
  marginTop: verticalScale(12),
  borderWidth: moderateScale(1),
  borderRadius: BORDER_RADIUS.f4,
  alignItems: 'center',
  justifyContent: 'center',
  borderStyle: 'dashed',
  flexDirection: 'row',
};
const $icon: TextStyle = {
  fontSize: moderateScale(18),
};
const $textAddPrice: TextStyle = {
  fontSize: FONT_SIZE.f2,
  fontWeight: 'bold',
  marginLeft: scale(4),
};

export default PricesEdit;
