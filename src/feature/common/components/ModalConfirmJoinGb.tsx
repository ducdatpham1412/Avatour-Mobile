import {apiChangeInformation} from 'api/setting';
import {updatePassport} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {IconEdit} from 'asset/icons';
import Images from 'asset/img/images';
import {horizontalPadding} from 'asset/metrics';
import {BORDER_RADIUS, FONT_SIZE} from 'asset/standardValue';
import {AppModalize} from 'components';
import {
  StyleButton,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import AppInput from 'components/base/AppInput';
import dayjs from 'dayjs';
import {useSafeArea, useTheme} from 'hook';
import {
  ModalDatePicker,
  ModalInputEdit,
  ModalTimePicker,
} from 'navigation/screen/modals';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {I18Normalize} from 'utility/I18Next';
import {borderWidthTiny, removePrefixPhone} from 'utility/assistant';
import {
  formatPhone,
  formatUTCDate,
  formathhmmddddDDMMYYYY,
} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {validateIsPhone} from 'utility/validate';

interface Props {
  onConfirm(params: Omit<TypeJoinRequest, 'saleId'>): void;
  loadingJoin: boolean;
  initValue?: Omit<TypeJoinRequest, 'saleId'>;
  titleButton?: I18Normalize;
}

const onAddPhone = () => {
  ModalInputEdit.show({
    onSave: async value => {
      const newPhone = removePrefixPhone(value);
      await apiChangeInformation({
        username: newPhone,
      });
      updatePassport({
        profile: {
          information: {
            phone: newPhone,
          },
        },
      });
    },
    keyboardType: 'numeric',
    placeholder: 'profile.phoneNumber',
    validateInput: text => text.includes('(+84) '),
    checkEnableButton: text => validateIsPhone(removePrefixPhone(text)),
    defaultValue: '(+84) ',
  });
};

const ModalConfirmJoinGb = (
  {onConfirm, loadingJoin, initValue, titleButton}: Props,
  ref: ForwardedRef<TypeShowModalize>,
) => {
  const {paddingBottom} = useSafeArea();
  const {t} = useTranslation();
  const theme = useTheme();
  const {phone} = useAppSelector(
    state => state.accountSlice.passport.profile.information,
  );

  const modalizeRef = useRef<ElementRef<typeof AppModalize>>(null);

  const [amount, setAmount] = useState(initValue?.amount ?? 1);
  const [timeWillJoin, setTimeWillJoin] = useState(
    initValue?.time_will_buy ? dayjs(initValue.time_will_buy) : undefined,
  );
  const note = useRef(initValue?.note ?? '');

  useImperativeHandle(
    ref,
    () => ({
      show: () => modalizeRef.current?.show(),
      hide: () => modalizeRef.current?.hide(),
    }),
    [],
  );

  const onChangeAmount = (value: number) => {
    const nextAmount = amount + value;
    if (nextAmount === 0) {
      return;
    }
    setAmount(nextAmount);
  };

  const selectDay = () => {
    if (timeWillJoin) {
      return (
        <View style={[$timeJoin, {borderColor: theme.p_600}]}>
          <StyleText
            originValue={`${formathhmmddddDDMMYYYY(timeWillJoin)}`}
            customStyle={$textJoinDate}
          />
          <StyleTouchable
            onPress={() => {
              ModalDatePicker.show({
                date: formatUTCDate(timeWillJoin),
                onChangeRange: value => {
                  setTimeWillJoin(dayjs(value.date));
                  ModalTimePicker.show({
                    title: 'profile.selectHour',
                    onChange: v => {
                      setTimeWillJoin(pre => {
                        if (pre) {
                          return pre.hour(v.hours).minute(v.minutes);
                        }
                      });
                    },
                  });
                },
                validRange: {
                  startDate: new Date(),
                },
              });
            }}>
            <IconEdit tintColor={theme.gray_600} />
          </StyleTouchable>
        </View>
      );
    }

    return (
      <StyleTouchable
        customStyle={[$timeJoin, {borderColor: theme.p_600}]}
        onPress={() => {
          ModalDatePicker.show({
            date: formatUTCDate(timeWillJoin),
            onChangeRange: value => {
              setTimeWillJoin(dayjs(value.date));
              ModalTimePicker.show({
                title: 'profile.selectHour',
                onChange: v => {
                  setTimeWillJoin(pre => {
                    if (pre) {
                      return pre.hour(v.hours).minute(v.minutes);
                    }
                  });
                },
              });
            },
            validRange: {
              startDate: new Date(),
            },
          });
        }}>
        <StyleText i18Text="profile.selectTime" />
        <IconEdit tintColor={theme.gray_600} />
      </StyleTouchable>
    );
  };

  return (
    <>
      <AppModalize ref={modalizeRef} containerStyle={{paddingBottom}}>
        <StyleText
          i18Text="discovery.joinGroupBuying"
          customStyle={$textHeader}
        />
        <StyleIcon
          source={Images.images.squirrelLogin}
          size={50}
          customStyle={$icon}
        />

        <View style={$enterInfoView}>
          <StyleText
            i18Text="discovery.amount"
            customStyle={$textTitleEnterInfo}
          />
          <View style={$infoBox}>
            <StyleTouchable onPress={() => onChangeAmount(-1)} hitSlop={10}>
              <AntDesign
                name="minussquareo"
                style={[$iconMinusPlus, {color: theme.gray_500}]}
              />
            </StyleTouchable>
            <StyleText originValue={amount} customStyle={$textAmount} />
            <StyleTouchable onPress={() => onChangeAmount(1)} hitSlop={10}>
              <AntDesign
                name="plussquareo"
                style={[$iconMinusPlus, {color: theme.gray_500}]}
              />
            </StyleTouchable>
          </View>
        </View>

        <View
          style={[
            $enterInfoView,
            {flexDirection: 'column', alignItems: 'flex-start'},
          ]}>
          <StyleText
            i18Text="discovery.arrivalTime"
            customStyle={$textTitleEnterInfo}
          />
          {selectDay()}
        </View>

        <View style={$enterInfoView}>
          <StyleText i18Text="login.phone" customStyle={$textTitleEnterInfo}>
            <StyleText originValue=":" customStyle={$textTitleEnterInfo} />
          </StyleText>
          <View style={$infoBox}>
            <StyleTouchable
              onPress={onAddPhone}
              disable={!!phone}
              disableOpacity={1}>
              {phone ? (
                <StyleText
                  originValue={formatPhone(phone)}
                  customStyle={[
                    $textJoinDate,
                    {
                      textDecorationLine: 'none',
                    },
                  ]}
                />
              ) : (
                <StyleText
                  i18Text="discovery.addPhoneNumber"
                  customStyle={[
                    $textJoinDate,
                    {
                      color: theme.red,
                    },
                  ]}
                />
              )}
            </StyleTouchable>
          </View>
        </View>

        <AppInput
          defaultValue={note.current}
          onChangeText={text => (note.current = text)}
          style={[
            $inputNote,
            {
              borderColor: theme.gray_300,
            },
          ]}
          placeholder={t('discovery.noteForMerchant')}
          multiline
        />

        <StyleButton
          title={titleButton ?? 'discovery.joinGroupBuying'}
          containerStyle={$button}
          onPress={() => {
            if (timeWillJoin) {
              onConfirm({
                amount,
                time_will_buy: formatUTCDate(timeWillJoin),
                note: note.current,
              });
            }
          }}
          disable={!phone}
          isLoading={loadingJoin}
        />
      </AppModalize>
    </>
  );
};

const $textHeader: TextStyle = {
  fontSize: FONT_SIZE.f1,
  marginTop: verticalScale(4),
  fontWeight: 'bold',
  alignSelf: 'center',
};
const $icon: ImageStyle = {
  marginTop: verticalScale(8),
  alignSelf: 'center',
};
const $button: ViewStyle = {
  width: '90%',
  marginTop: verticalScale(20),
  paddingVertical: scale(4),
};
const $enterInfoView: ViewStyle = {
  flexDirection: 'row',
  marginTop: verticalScale(20),
  alignItems: 'center',
};
const $textTitleEnterInfo: TextStyle = {
  fontSize: FONT_SIZE.f2,
  fontWeight: 'bold',
};
const $infoBox: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: scale(20),
};
const $iconMinusPlus: TextStyle = {
  fontSize: moderateScale(20),
};
const $textAmount: TextStyle = {
  fontSize: FONT_SIZE.f2,
  fontWeight: 'bold',
  width: moderateScale(50),
  textAlign: 'center',
};
const $textJoinDate: TextStyle = {
  fontSize: FONT_SIZE.f2,
  textDecorationLine: 'underline',
};
const $inputNote: TextStyle = {
  width: '100%',
  height: verticalScale(100),
  borderWidth: borderWidthTiny,
  borderRadius: BORDER_RADIUS.f3,
  marginTop: verticalScale(20),
  paddingHorizontal: scale(8),
  paddingTop: verticalScale(8),
  paddingBottom: verticalScale(8),
  fontSize: FONT_SIZE.f2,
};
const $timeJoin: ViewStyle = {
  width: '100%',
  height: moderateScale(40),
  marginTop: verticalScale(4),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderWidth: moderateScale(1),
  borderRadius: BORDER_RADIUS.f4,
  borderStyle: 'dashed',
  paddingHorizontal: horizontalPadding,
};

export default forwardRef(ModalConfirmJoinGb);
