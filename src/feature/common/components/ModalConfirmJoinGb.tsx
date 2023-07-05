import {apiChangeInformation} from 'api/setting';
import {updatePassport} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import Images from 'asset/img/images';
import {safePaddingNotZero} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {AppModalize} from 'components';
import {
  StyleButton,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import AppInput from 'components/base/AppInput';
import dayjs from 'dayjs';
import {useTheme} from 'hook';
import {ModalDatePicker, ModalInputEdit} from 'navigation/screen/modals';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {borderWidthTiny} from 'utility/assistant';
import {addDate, formatDayGroupBuying, formatUTCDate} from 'utility/format';
import {validateIsPhone} from 'utility/validate';
import AddPhone from './AddPhone';

interface Props {
  onConfirm(params: Omit<TypeJoinRequest, 'saleId'>): void;
  loadingJoin: boolean;
  initValue?: Omit<TypeJoinRequest, 'saleId'>;
}

const onAddPhone = () => {
  ModalInputEdit.show({
    onSave: async value => {
      await apiChangeInformation({
        username: value,
      });
      updatePassport({profile: {information: {phone: value}}});
    },
    keyboardType: 'numeric',
    placeholder: 'profile.phoneNumber',
    checkValid: value => validateIsPhone(value),
  });
};

const ModalConfirmJoinGb = (
  {onConfirm, loadingJoin, initValue}: Props,
  ref: ForwardedRef<TypeShowModalize>,
) => {
  const {bottom} = useSafeAreaInsets();
  const {t} = useTranslation();
  const theme = useTheme();
  const {phone} = useAppSelector(
    state => state.accountSlice.passport.profile.information,
  );

  const modalizeRef = useRef<ElementRef<typeof AppModalize>>(null);
  const modalAddPhoneRef = useRef<Modalize>(null);

  const [amount, setAmount] = useState(initValue?.amount ?? 1);
  const [timeWillJoin, setTimeWillJoin] = useState(
    formatUTCDate(
      initValue?.time_will_buy ??
        addDate(dayjs(), {
          value: 1,
          unit: 'day',
        }),
    ),
  );
  const [note, setNote] = useState(initValue?.note ?? '');

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

  return (
    <>
      <AppModalize
        ref={modalizeRef}
        containerStyle={{paddingBottom: bottom || safePaddingNotZero}}>
        <StyleText
          i18Text="discovery.joinGroupBuying"
          customStyle={styles.textHeader}
        />
        <StyleIcon
          source={Images.images.squirrelLogin}
          size={50}
          customStyle={styles.icon}
        />
        {/* <StyleText
          i18Text="discovery.titleDeposit"
          customStyle={styles.textTitle}
        />
        <StyleText
          i18Text="discovery.theMoneyIs"
          customStyle={[styles.textTitle, {color: theme.textColor}]}>
          {!!chosenDeposit && (
            <StyleText
              originValue={`${formatLocaleNumber(
                String(chosenDeposit.value),
              )}vnd`}
              customStyle={[styles.textMoney, {color: theme.highlightColor}]}
            />
          )}
        </StyleText> */}

        <View style={styles.enterInfoView}>
          <StyleText
            i18Text="discovery.amount"
            customStyle={styles.textTitleEnterInfo}
          />
          <View style={styles.minusPlusBox}>
            <StyleTouchable onPress={() => onChangeAmount(-1)} hitSlop={10}>
              <AntDesign
                name="minussquareo"
                style={[styles.iconMinusPlus, {color: theme.gray_500}]}
              />
            </StyleTouchable>
            <StyleText originValue={amount} customStyle={styles.textAmount} />
            <StyleTouchable onPress={() => onChangeAmount(1)} hitSlop={10}>
              <AntDesign
                name="plussquareo"
                style={[styles.iconMinusPlus, {color: theme.gray_500}]}
              />
            </StyleTouchable>
          </View>
        </View>

        <View style={styles.enterInfoView}>
          <StyleText
            i18Text="discovery.arrivalTime"
            customStyle={styles.textTitleEnterInfo}
          />
          <View style={styles.minusPlusBox}>
            <StyleTouchable
              onPress={() => {
                ModalDatePicker.show({
                  date: timeWillJoin,
                  onChangeRange: value => {
                    setTimeWillJoin(formatUTCDate(dayjs(value.date)));
                  },
                  validRange: {
                    startDate: new Date(),
                  },
                });
              }}>
              <StyleText
                originValue={`${formatDayGroupBuying(timeWillJoin)}`}
                customStyle={styles.textJoinDate}
              />
            </StyleTouchable>
          </View>
        </View>

        <View style={styles.enterInfoView}>
          <StyleText
            i18Text="login.signUp.type.phone"
            customStyle={styles.textTitleEnterInfo}>
            <StyleText
              originValue=":"
              customStyle={styles.textTitleEnterInfo}
            />
          </StyleText>
          <View style={styles.minusPlusBox}>
            <StyleTouchable
              onPress={onAddPhone}
              disable={!!phone}
              disableOpacity={1}>
              {phone ? (
                <StyleText
                  originValue={phone}
                  customStyle={[
                    styles.textJoinDate,
                    {
                      textDecorationLine: 'none',
                    },
                  ]}
                />
              ) : (
                <StyleText
                  i18Text="discovery.addPhoneNumber"
                  customStyle={[
                    styles.textJoinDate,
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
          value={note}
          onChangeText={text => setNote(text)}
          style={[
            styles.inputNote,
            {
              borderColor: theme.gray_300,
            },
          ]}
          placeholder={t('discovery.noteForMerchant')}
          multiline
        />

        <StyleButton
          title="discovery.joinGroupBuying"
          containerStyle={styles.button}
          onPress={() => {
            onConfirm({
              amount,
              time_will_buy: timeWillJoin,
              note,
            });
          }}
          disable={!phone}
          isLoading={loadingJoin}
        />
      </AppModalize>

      <Modalize
        ref={modalAddPhoneRef}
        adjustToContentHeight
        withHandle={false}
        modalStyle={{
          backgroundColor: 'transparent',
        }}>
        <AddPhone onCloseModal={() => modalAddPhoneRef.current?.close()} />
      </Modalize>
    </>
  );
};

const styles = ScaledSheet.create({
  textHeader: {
    fontSize: FONT_SIZE.f1,
    marginTop: '5@vs',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  icon: {
    marginTop: '10@vs',
    alignSelf: 'center',
  },
  button: {
    marginTop: '20@vs',
    marginBottom: '5@vs',
    paddingVertical: '5@vs',
  },
  enterInfoView: {
    flexDirection: 'row',
    marginTop: '20@vs',
    alignItems: 'center',
  },
  textTitleEnterInfo: {
    fontSize: FONT_SIZE.f2,
    fontWeight: 'bold',
  },
  minusPlusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '20@s',
  },
  iconMinusPlus: {
    fontSize: '20@ms',
  },
  textAmount: {
    fontSize: FONT_SIZE.f2,
    fontWeight: 'bold',
    width: '50@ms',
    textAlign: 'center',
  },
  textJoinDate: {
    fontSize: FONT_SIZE.f2,
    textDecorationLine: 'underline',
  },
  inputNote: {
    width: '100%',
    height: '100@vs',
    borderWidth: borderWidthTiny,
    borderRadius: '10@ms',
    marginTop: '20@vs',
    paddingHorizontal: '7@ms',
    paddingTop: '7@ms',
    paddingBottom: '7@ms',
    fontSize: FONT_SIZE.f2,
  },
});

export default forwardRef(ModalConfirmJoinGb);
