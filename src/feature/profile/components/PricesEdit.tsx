import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React, {ElementRef, useRef} from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {borderWidthTiny} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalAddPrice, TypeChangePrice} from '../post';
import ButtonIconTitle from './ButtonIconTitle';

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
  const modalPriceRef = useRef<ElementRef<typeof ModalAddPrice>>(null);

  return (
    <>
      <View style={[$container, containerStyle]}>
        {prices.map((price, index) => {
          return (
            <View key={price.number_people} style={$priceBox}>
              <View style={[$numberPeopleBox, {borderColor: theme.gray_500}]}>
                <StyleText
                  originValue={price.number_people}
                  customStyle={[$textNumberPeople, {color: theme.black}]}
                />
              </View>
              <StyleText
                originValue="-"
                customStyle={[$textMiddle, {color: theme.black}]}
              />
              <View style={[$priceValue, {borderColor: theme.p_800}]}>
                <StyleText
                  originValue={`${formatLocaleNumber(price.price)} vnd`}
                  customStyle={{
                    fontWeight: FONT_WEIGHT_MEDIUM,
                    color: theme.p_800,
                  }}
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
                    <Feather
                      name="edit-2"
                      style={[$iconEdit, {color: theme.gray_500}]}
                    />
                  </StyleTouchable>
                  {price.number_people === 1 ? (
                    <View style={$deleteBox} />
                  ) : (
                    <StyleTouchable
                      customStyle={$deleteBox}
                      onPress={() => onDeletePrice?.(price)}>
                      <Feather
                        name="x"
                        style={[$iconDelete, {color: theme.gray_500}]}
                      />
                    </StyleTouchable>
                  )}
                </>
              )}
            </View>
          );
        })}
        {enableEdit && (
          <ButtonIconTitle
            title="profile.addPrice"
            onPress={() => modalPriceRef.current?.show()}
            containerStyle={$buttonInfo}
            titleFontWeight="bold"
            buttonStyle={{borderColor: theme.black}}
          />
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
  width: '90%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(8),
  alignSelf: 'center',
};
const $numberPeopleBox: ViewStyle = {
  flex: 1,
  paddingVertical: verticalScale(4),
  borderWidth: borderWidthTiny,
  borderRadius: BORDER_RADIUS.f4,
  alignItems: 'center',
};
const $textNumberPeople: TextStyle = {
  fontSize: FONT_SIZE.f2,
};
const $textMiddle: TextStyle = {
  marginHorizontal: scale(12),
  fontWeight: 'bold',
};
const $priceValue: ViewStyle = {
  flex: 2,
  paddingVertical: verticalScale(4),
  borderWidth: borderWidthTiny,
  borderRadius: BORDER_RADIUS.f4,
  paddingHorizontal: scale(20),
};
const $editBox: ViewStyle = {
  marginLeft: scale(13),
};
const $iconEdit: TextStyle = {
  fontSize: moderateScale(20),
};
const $deleteBox: ViewStyle = {
  marginLeft: scale(20),
  width: moderateScale(15),
};
const $iconDelete: TextStyle = {
  fontSize: moderateScale(15),
};
const $buttonInfo: ViewStyle = {
  marginTop: verticalScale(12),
  marginLeft: '5%',
};

export default PricesEdit;
