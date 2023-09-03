import AsyncStorage from '@react-native-async-storage/async-storage';
import {BORDER_RADIUS, LIST_TOPICS, LIST_TRANSPORTS} from 'asset';
import {ASYNC_TYPE} from 'asset/enum';
import Images from 'asset/img/images';
import {safePaddingNotZero} from 'asset/metrics';
import {AppModalize} from 'components';
import {
  AppInput,
  ModalEdit,
  StyleButton,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useTheme} from 'hook';
import {ModalDateRangePicker} from 'navigation/screen/modals';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ImageStyle,
  Keyboard,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {I18Normalize} from 'utility/I18Next';
import {borderWidthTiny} from 'utility/assistant';
import {
  formatDDMMMM,
  formatInputNumber,
  formatLocaleNumber,
  formatMoney,
  formatUTCDate,
} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {useFilterSearch} from '../hooks';
import TickBox from './TickBox';
interface Props {
  onChangeSearch: (value: TypeSearchParams) => void;
  initSearchParams: TypeSearchParams;
  titleButton?: I18Normalize;
  notIncludes?: Array<
    'transport' | 'number_people' | 'date_time' | 'services' | 'price'
  >;
  isGetFromAsync: boolean;
  editable?: boolean;
}

interface IndicatorProps {
  color: string;
}

interface TypeParamsChosenPrice {
  prices: TypePriceResource[];
  start_price: number | undefined;
  end_price: number | undefined;
}

const Indicator = ({color}: IndicatorProps) => (
  <View style={[$indicatorView, {backgroundColor: color}]} />
);

export const chosenPrice = (
  params: TypeParamsChosenPrice,
): TypePriceResource[] => {
  const {prices, start_price, end_price} = params;
  if (!end_price || !start_price) {
    return [prices[0]];
  }
  return prices.filter(item => {
    const checkIncludedStart = item?.value?.[1] >= start_price;
    const checkIncludedEnd = item?.value?.[0] <= end_price;
    return checkIncludedStart || checkIncludedEnd;
  });
};

const ModalSearchFilter = (
  {
    onChangeSearch,
    initSearchParams,
    titleButton,
    notIncludes = [],
    isGetFromAsync,
    editable = true,
  }: Props,
  ref: ForwardedRef<TypeShowModalize>,
) => {
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();

  const modalEditPriceRef = useRef<ElementRef<typeof ModalEdit>>(null);
  const startPriceRef = useRef<TextInput>(null);
  const endPriceRef = useRef<TextInput>(null);

  //   const [startLocation, setStartLocation] = useState(
  //     initSearchParams?.start_location ?? '',
  //   );
  const [startPrice, setStartPrice] = useState('');
  const [endPrice, setEndPrice] = useState('');

  const [
    {searchParams, setSearchParams},
    {onPressService, onChangeNumberPeople, onPressVehicle, onSavePrice},
  ] = useFilterSearch({onChangeSearch, initSearchParams, isGetFromAsync});

  const onSave = async () => {
    onChangeSearch(searchParams);
    const temp: any = ref;
    temp?.current?.hide();
    await AsyncStorage.setItem(
      ASYNC_TYPE.searchParams,
      JSON.stringify(searchParams),
    );
  };

  return (
    <>
      <AppModalize
        ref={ref}
        panGestureEnabled
        onOpen={() => Keyboard.dismiss()}
        containerStyle={{paddingBottom: bottom || safePaddingNotZero}}>
        {/*
        TODO: When develop search suggest vehicle for "start-location"
        */}
        {/* <InputSearch
          placeholder={
            searchPlaceHolder ? t(searchPlaceHolder) : t('profile.location')
          }
          onFocus={() => setCloseOnOverlayEnable(false)}
          onBlur={() => setCloseOnOverlayEnable(true)}
          icon={
            <StyleIcon
              source={Images.icons.location}
              size={15}
              customStyle={{tintColor: theme.black}}
            />
          }
          value={startLocation}
          onChangeText={text => setStartLocation(text)}
          editable={editable}
        /> */}

        {!notIncludes?.includes('transport') && (
          <>
            <TickBox
              title="discovery.vehicle"
              listOptions={LIST_TRANSPORTS.map(item => ({
                id: item.id,
                text: item.text,
              }))}
              listChosen={LIST_TRANSPORTS.filter(item =>
                searchParams?.transports?.includes(item.id),
              )}
              onPressOption={onPressVehicle}
              disable={!editable}
              pick="check-box"
            />
            <Indicator color={theme.gray_300} />
          </>
        )}

        <View
          style={[
            $numberPeopleView,
            {
              marginTop: !notIncludes?.includes('transport')
                ? verticalScale(12)
                : 0,
            },
          ]}>
          <StyleText
            i18Text="discovery.numberPeople"
            customStyle={$textTitle}
          />
          <View style={$pressPeopleBox}>
            <StyleTouchable
              customStyle={[$btnPeople, {backgroundColor: theme.p_100}]}
              onPress={() => onChangeNumberPeople(-1)}
              disable={!editable}>
              <AntDesign
                name="minus"
                style={[$textBtnPeople, {color: theme.black}]}
              />
            </StyleTouchable>
            <StyleText
              originValue={searchParams?.number_people}
              customStyle={$textNumberPeople}
            />
            <StyleTouchable
              customStyle={[$btnPeople, {backgroundColor: theme.p_100}]}
              onPress={() => onChangeNumberPeople(1)}
              disable={!editable}>
              <AntDesign
                name="plus"
                style={[$textBtnPeople, {color: theme.black}]}
              />
            </StyleTouchable>
          </View>
        </View>
        <Indicator color={theme.gray_300} />

        {!notIncludes?.includes('date_time') && (
          <>
            <View style={$contentBox}>
              <StyleText
                i18Text="discovery.timeTravel"
                customStyle={$textTitle}
              />
              <View style={[$timeBox, {borderColor: theme.gray_300}]}>
                <StyleIcon
                  source={Images.icons.calendar}
                  size={20}
                  customStyle={$iconCalendar}
                />
                <StyleTouchable
                  style={$timePart}
                  onPress={() =>
                    ModalDateRangePicker.show({
                      startDate: searchParams.start_time || '',
                      endDate: searchParams.end_time || '',
                      onChangeRange: value => {
                        setSearchParams(pre => ({
                          ...pre,
                          start_time: formatUTCDate(value.startDate),
                          end_time: formatUTCDate(value.endDate),
                        }));
                      },
                      validRange: {
                        startDate: new Date(),
                      },
                    })
                  }
                  disable={!editable}
                  disableOpacity={1}>
                  <View>
                    <StyleText
                      i18Text="discovery.departure"
                      customStyle={{color: theme.gray_500}}
                    />
                    <StyleText
                      originValue={formatDDMMMM(searchParams?.start_time || '')}
                    />
                  </View>
                  <View
                    style={[$indicatorTime, {backgroundColor: theme.gray_300}]}
                  />
                  <View>
                    <StyleText
                      i18Text="discovery.comeback"
                      customStyle={{color: theme.gray_500}}
                    />
                    <StyleText
                      originValue={formatDDMMMM(searchParams?.end_time || '')}
                    />
                  </View>
                </StyleTouchable>
              </View>
            </View>
            <Indicator color={theme.gray_300} />
          </>
        )}

        <TickBox
          title="discovery.chooseTopic"
          containerStyle={$contentBox}
          listOptions={LIST_TOPICS.map(item => ({
            id: item.id,
            text: item.text,
          }))}
          listChosen={LIST_TOPICS.filter(item =>
            searchParams?.services?.includes(item.id),
          )}
          onPressOption={onPressService}
          disable={!editable}
          layOut="grid"
          pick="check-box"
        />

        <Indicator color={theme.gray_300} />

        <StyleText i18Text="discovery.price" customStyle={$titlePrice} />
        <View style={$inputPriceView}>
          <StyleTouchable
            customStyle={[$inputPrice, {borderColor: theme.gray_500}]}
            onPress={() => {
              modalEditPriceRef.current?.show();
              setStartPrice(String(searchParams?.start_price ?? ''));
              setEndPrice(String(searchParams?.end_price ?? ''));
              setTimeout(() => {
                startPriceRef.current?.focus();
              }, 300);
            }}
            disable={!editable}
            disableOpacity={1}>
            <StyleText
              originValue={formatMoney(searchParams.start_price ?? 0)}
            />
          </StyleTouchable>
          <StyleText originValue="~" customStyle={$dividerPrice} />
          <StyleTouchable
            customStyle={[$inputPrice, {borderColor: theme.gray_500}]}
            onPress={() => {
              modalEditPriceRef.current?.show();
              setStartPrice(String(searchParams?.start_price ?? ''));
              setEndPrice(String(searchParams?.end_price ?? ''));
              setTimeout(() => {
                endPriceRef.current?.focus();
              }, 300);
            }}
            disable={!editable}
            disableOpacity={1}>
            <StyleText originValue={formatMoney(searchParams.end_price ?? 0)} />
          </StyleTouchable>
        </View>

        {editable && (
          <StyleButton
            title={titleButton ?? 'common.search'}
            containerStyle={$buttonView}
            onPress={onSave}
          />
        )}
      </AppModalize>

      <ModalEdit
        title="discovery.price"
        ref={modalEditPriceRef}
        onSave={() => {
          onSavePrice(Number(startPrice), Number(endPrice));
          modalEditPriceRef.current?.hide();
        }}>
        <View style={[$inputPriceView, {marginTop: 0}]}>
          <AppInput
            ref={startPriceRef}
            style={[$inputPrice, {borderColor: theme.gray_500}]}
            value={formatLocaleNumber(startPrice)}
            onChangeText={text => {
              const temp = formatInputNumber(text);
              if (temp !== null) {
                setStartPrice(temp);
              }
            }}
            placeholder={t('discovery.price')}
            keyboardType="numeric"
            editable={editable}
          />
          <StyleText originValue="~" customStyle={$dividerPrice} />
          <AppInput
            ref={endPriceRef}
            style={[$inputPrice, {borderColor: theme.gray_500}]}
            value={formatLocaleNumber(endPrice)}
            onChangeText={text => {
              const temp = formatInputNumber(text);
              if (temp !== null) {
                setEndPrice(temp);
              }
            }}
            placeholder={t('discovery.price')}
            keyboardType="numeric"
            editable={editable}
          />
        </View>
      </ModalEdit>
    </>
  );
};

const $contentBox: ViewStyle = {
  marginTop: verticalScale(12),
};
const $indicatorView: ViewStyle = {
  width: '100%',
  height: moderateScale(0.5),
  marginTop: verticalScale(12),
};
const $numberPeopleView: ViewStyle = {
  marginTop: verticalScale(12),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const $pressPeopleBox: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $btnPeople: ViewStyle = {
  width: moderateScale(24),
  height: moderateScale(24),
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 50,
};
const $textBtnPeople: TextStyle = {
  fontSize: moderateScale(17),
};
const $textTitle: TextStyle = {
  fontWeight: 'bold',
};
const $textNumberPeople: TextStyle = {
  fontWeight: 'bold',
  marginHorizontal: scale(20),
};
const $timeBox: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(8),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: borderWidthTiny,
  borderRadius: BORDER_RADIUS.f3,
  paddingVertical: verticalScale(8),
};
const $timePart: ViewStyle = {
  marginLeft: scale(16),
  flexDirection: 'row',
  alignItems: 'center',
};
const $indicatorTime: ViewStyle = {
  width: moderateScale(1),
  height: verticalScale(30),
  marginHorizontal: scale(20),
};
const $iconCalendar: ImageStyle = {
  position: 'absolute',
  left: scale(20),
};
const $titlePrice: TextStyle = {
  marginTop: verticalScale(12),
  fontWeight: 'bold',
};
const $inputPriceView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(8),
};
const $inputPrice: ViewStyle = {
  flex: 1,
  height: moderateScale(40),
  borderWidth: borderWidthTiny,
  borderRadius: BORDER_RADIUS.f3,
  paddingHorizontal: scale(8),
  justifyContent: 'center',
};
const $dividerPrice: TextStyle = {
  marginHorizontal: scale(8),
};
const $buttonView: ViewStyle = {
  marginTop: verticalScale(16),
  width: '80%',
};

export default forwardRef(ModalSearchFilter);
