import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {ModalEdit, StyleText} from 'components/base';
import AppInput from 'components/base/AppInput';
import {useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput, TextStyle, View} from 'react-native';
import {borderWidthTiny} from 'utility/assistant';
import {formatLocaleNumber, formatNormalNumberFromLocale} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';
import {scale, verticalScale} from 'utility/scale';
import {validateIsNumber} from 'utility/validate';

export type TypeChangePrice = {
  indexEdit: number;
  value: TypePrice;
};

interface Props {
  prices: Array<TypePrice>;
  onAddPrice(value: TypePrice): void;
  onChangePrice(params: TypeChangePrice): void;
}

interface TypeShow {
  numberPeople: number;
  price: number;
  indexEdit: number;
}

const ModalAddPrice = (
  {prices, onAddPrice, onChangePrice}: Props,
  ref: ForwardedRef<TypeShowModalize<TypeShow>>,
) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const inputNumberRef = useRef<TextInput>(null);
  const inputPriceRef = useRef<TextInput>(null);
  const indexEdit = useRef<number>();
  const modalRef = useRef<ElementRef<typeof ModalEdit>>(null);

  const [numberPeople, setNumberPeople] = useState(0);
  const [price, setPrice] = useState(0);

  let isValidNumberPeople = true;
  let textAlertNumberPeople: I18Normalize = 'common.null';
  const paramsNumberPeople: any = {};

  let isValidPriceValue = true;
  let textAlertPrice: I18Normalize = 'common.null';
  const paramsPrice: any = {};

  // Add new one
  if (indexEdit.current === undefined) {
    const lastPrice = prices[prices.length - 1];
    if (lastPrice) {
      if (numberPeople < lastPrice.number_people) {
        isValidNumberPeople = false;
        textAlertNumberPeople = 'alert.numberPeopleMoreThan';
        paramsNumberPeople.value = lastPrice.number_people;
      }

      isValidPriceValue = price < lastPrice.price && !!price;
      textAlertPrice = 'alert.priceLessThan';
      paramsPrice.value = formatLocaleNumber(lastPrice.price);
    } else if (numberPeople !== 1) {
      isValidNumberPeople = false;
      textAlertNumberPeople = 'alert.firstNumberPeopleByOne';
    }
  }

  // Edit an index price
  else {
    const start = prices[indexEdit.current - 1];
    const end = prices[indexEdit.current + 1];
    if (start && end) {
      isValidNumberPeople =
        numberPeople > start.number_people && numberPeople < end.number_people;
      textAlertNumberPeople = 'alert.numberPeopleMoreAndLess';
      paramsNumberPeople.start = start.number_people;
      paramsNumberPeople.end = end.number_people;

      isValidPriceValue = price < start.price && price > end.price;
      textAlertPrice = 'alert.priceMoreLessThan';
      paramsPrice.start = formatLocaleNumber(start.price);
      paramsPrice.end = formatLocaleNumber(end.price);
    } else if (start) {
      // Editing the last
      isValidNumberPeople = numberPeople > start.number_people;
      textAlertNumberPeople = 'alert.numberPeopleMoreThan';
      paramsNumberPeople.value = start.number_people;

      isValidPriceValue = price < start.price;
      textAlertPrice = 'alert.priceLessThan';
      paramsPrice.value = formatLocaleNumber(start.price);
    } else if (end) {
      // Editing the first
      isValidNumberPeople = numberPeople === 1;
      if (!isValidNumberPeople) {
        textAlertNumberPeople = 'alert.firstNumberPeopleByOne';
      }

      isValidPriceValue = price > end.price;
      textAlertPrice = 'alert.priceMoreThan';
      paramsPrice.value = formatLocaleNumber(end.price);
    } else if (numberPeople !== 1) {
      isValidNumberPeople = false;
      textAlertNumberPeople = 'alert.firstNumberPeopleByOne';
    }
  }

  const borderWidthNumber = isValidNumberPeople ? 0 : borderWidthTiny;
  const borderWidthPrice = isValidPriceValue ? 0 : borderWidthTiny;
  const disableButton = !isValidNumberPeople || !isValidPriceValue;

  useImperativeHandle(
    ref,
    () => ({
      show: value => {
        if (value) {
          setNumberPeople(value.numberPeople);
          setPrice(value.price);
          indexEdit.current = value.indexEdit;
        } else {
          const lastPrice = prices[prices.length - 1];
          setNumberPeople(
            lastPrice?.number_people ? lastPrice?.number_people + 1 : 1,
          );
        }
        modalRef.current?.show();
        setTimeout(() => {
          inputPriceRef.current?.focus();
        }, 300);
      },
      hide: () => {
        modalRef.current?.hide();
      },
    }),
    [prices],
  );

  const onClosed = () => {
    setNumberPeople(0);
    setPrice(0);
    indexEdit.current = undefined;
  };

  const onSave = () => {
    if (indexEdit.current === undefined) {
      onAddPrice({
        number_people: numberPeople,
        price,
      });
    } else {
      onChangePrice({
        indexEdit: indexEdit.current,
        value: {
          number_people: numberPeople,
          price,
        },
      });
    }
    modalRef.current?.hide();
    onClosed();
  };

  return (
    <ModalEdit
      ref={modalRef}
      title="profile.addPrice"
      onPressClose={onClosed}
      onSave={onSave}
      disable={disableButton}>
      <View style={$inputView}>
        <AppInput
          ref={inputNumberRef}
          value={numberPeople === 0 ? '' : formatLocaleNumber(numberPeople)}
          onChangeText={value => {
            const temp = formatNormalNumberFromLocale(value);
            if (validateIsNumber(temp)) {
              setNumberPeople(Number(temp));
            } else if (value === '') {
              setNumberPeople(0);
            }
          }}
          placeholder={t('profile.number')}
          style={[
            $inputNumberPeople,
            {
              backgroundColor: theme.background,
              borderWidth: borderWidthNumber,
            },
          ]}
          onSubmitEditing={() => inputPriceRef.current?.focus()}
          keyboardType="numeric"
          returnKeyType="next"
        />
        <StyleText
          originValue="-"
          customStyle={[$textMiddle, {color: theme.black}]}
        />
        <View
          style={[
            $inputPriceBox,
            {
              backgroundColor: theme.background,
              borderWidth: borderWidthPrice,
            },
          ]}>
          <AppInput
            ref={inputPriceRef}
            value={price === 0 ? '' : formatLocaleNumber(price)}
            onChangeText={value => {
              const temp = formatNormalNumberFromLocale(value);
              if (validateIsNumber(temp)) {
                setPrice(Number(temp));
              } else if (value === '') {
                setPrice(0);
              }
            }}
            placeholder={t('profile.price')}
            style={$inputPrice}
            keyboardType="numeric"
          />
          <StyleText originValue="vnd" customStyle={$textVnd} />
        </View>
      </View>

      {!isValidNumberPeople && (
        <StyleText
          i18Text={textAlertNumberPeople}
          i18Params={paramsNumberPeople}
          customStyle={[$textInvalidLink, {color: theme.red}]}
        />
      )}

      {!isValidPriceValue && (
        <StyleText
          i18Text={textAlertPrice}
          i18Params={paramsPrice}
          customStyle={[
            $textInvalidLink,
            {color: theme.red, marginTop: verticalScale(4)},
          ]}
        />
      )}
    </ModalEdit>
  );
};

const $textMiddle: TextStyle = {
  fontSize: FONT_SIZE.f1,
  fontWeight: FONT_WEIGHT_MEDIUM,
  marginHorizontal: scale(12),
};
const $inputView: TextStyle = {
  width: '100%',
  marginTop: verticalScale(12),
  paddingHorizontal: scale(8),
  flexDirection: 'row',
  alignItems: 'center',
};
const $inputNumberPeople: TextStyle = {
  flex: 1,
  marginVertical: 0,
  paddingTop: verticalScale(8),
  paddingBottom: verticalScale(8),
  paddingHorizontal: scale(8),
  borderRadius: BORDER_RADIUS.f4,
  borderColor: Theme.common.red,
  fontSize: FONT_SIZE.f1,
};
const $inputPriceBox: TextStyle = {
  flex: 3,
  marginVertical: 0,
  borderRadius: BORDER_RADIUS.f4,
  borderColor: Theme.common.red,
  flexDirection: 'row',
  alignItems: 'center',
};
const $inputPrice: TextStyle = {
  flex: 1,
  marginVertical: 0,
  paddingTop: verticalScale(8),
  paddingBottom: verticalScale(8),
  paddingHorizontal: scale(8),
  fontSize: FONT_SIZE.f1,
};
const $textVnd: TextStyle = {
  marginRight: scale(8),
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $textInvalidLink: TextStyle = {
  fontSize: FONT_SIZE.f3,
  alignSelf: 'flex-start',
  marginTop: verticalScale(12),
  marginLeft: scale(10),
};

export default forwardRef(ModalAddPrice);
