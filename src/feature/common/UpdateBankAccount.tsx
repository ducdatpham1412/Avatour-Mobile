import {apiGetUpdateBank, apiUpdateBankAccount} from 'api/authentication';
import {useAppSelector} from 'app-redux/store';
import {safePaddingNotZero} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {
  StyleButton,
  StyleContainer,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useLoading, useTheme} from 'hook';
import {appAlert, goBack} from 'navigation/NavigationService';
import {ModalAlert, ModalInputEdit} from 'navigation/screen/modals';
import React, {useEffect, useRef, useState} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScaledSheet, scale} from 'react-native-size-matters';
import useSWR from 'swr';
import {borderWidthTiny, logger} from 'utility/assistant';
import {verticalScale} from 'utility/scale';
import ModalChooseBank from './components/ModalChooseBank';

type TypeChosenBank = {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string;
};

const UpdateBankAccount = () => {
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();
  const {
    profile: {information},
  } = useAppSelector(state => state.accountSlice.passport);

  const getUpdateBank = useSWR('get-update-bank', async () => {
    const res = await apiGetUpdateBank();
    return res.data;
  });

  const {loading, setLoading} = useLoading();

  const modalChooseBankRef = useRef<ModalChooseBank>(null);

  const [chosenBank, setChosenBank] = useState<TypeChosenBank>();
  const [bankAccount, setBankAccount] = useState(information.bank_account);

  const disableButton =
    !chosenBank ||
    !bankAccount ||
    (chosenBank?.code === information.bank_code &&
      bankAccount === information.bank_account);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch('https://api.vietqr.io/v2/banks');
        const {data} = await res.json();
        const temp: TypeChosenBank = data.find(
          (item: TypeChosenBank) => item?.code === information.bank_code,
        );
        if (temp) {
          setChosenBank(temp);
        }
      } catch (err) {
        logger(err);
      }
    };
    if (information.bank_code && chosenBank === undefined) {
      getData();
    }
  }, [information.bank_code, chosenBank]);

  const onSave = async () => {
    if (chosenBank?.code) {
      const agreeChange = async () => {
        try {
          setLoading(true);
          await apiUpdateBankAccount({
            bank_code: chosenBank?.code,
            bank_account: bankAccount,
          });
          ModalAlert.success({
            i18Content: 'alert.requestUpdateBankSuccess',
            onClose: goBack,
          });
        } catch (err) {
          appAlert(err);
        } finally {
          setLoading(false);
        }
      };

      ModalAlert.options({
        i18Content: 'alert.sureUpdateBankAccount',
        onContinue: agreeChange,
      });
    }
  };

  const renderUpdateBefore = () => {
    if (!getUpdateBank.data) {
      return null;
    }
    return (
      <View style={$preViewUpdate}>
        <StyleText
          i18Text="profile.havingRequestUpdate"
          customStyle={$textUpdateBefore}
        />
        <StyleText originValue="・">
          <StyleText i18Text="profile.bankName" />
          <StyleText originValue=": " />
          <StyleText
            originValue={getUpdateBank?.data?.data?.bank_code}
            customStyle={$textBankCode}
          />
        </StyleText>
        <StyleText originValue="・">
          <StyleText i18Text="profile.accountNumber" />
          <StyleText originValue=": " />
          <StyleText
            originValue={getUpdateBank?.data?.data?.bank_account}
            customStyle={$textBankCode}
          />
        </StyleText>
      </View>
    );
  };

  return (
    <>
      <StyleContainer
        headerProps={{
          title: 'profile.updateBankAccount',
          containerStyle: {
            backgroundColor: theme.white,
          },
        }}
        BottomComponent={
          <StyleButton
            title="common.save"
            containerStyle={{marginBottom: bottom || safePaddingNotZero}}
            disable={disableButton}
            isLoading={loading}
            onPress={onSave}
          />
        }
        containerStyle={{backgroundColor: theme.white}}>
        <StyleText
          i18Text="profile.bank"
          customStyle={styles.titleChooseBank}
        />
        <View style={styles.infoView}>
          <View style={[styles.infoBox, {borderColor: theme.gray_500}]}>
            {chosenBank ? (
              <StyleImage
                source={{uri: chosenBank.logo}}
                customStyle={styles.logoBank}
              />
            ) : (
              <StyleText
                i18Text="setting.personalInfo.notYet"
                customStyle={{color: theme.gray_500}}
              />
            )}
          </View>
          <StyleTouchable onPress={() => modalChooseBankRef.current?.show()}>
            <StyleText
              i18Text="profile.post.edit"
              customStyle={[styles.textEdit, {color: theme.p_900}]}
            />
          </StyleTouchable>
        </View>

        <StyleText
          i18Text="profile.accountNumber"
          customStyle={styles.titleAccountNumber}
        />
        <View style={styles.infoView}>
          <View style={[styles.infoBox, {borderColor: theme.gray_500}]}>
            {bankAccount ? (
              <StyleText originValue={bankAccount} />
            ) : (
              <StyleText
                i18Text="setting.personalInfo.notYet"
                customStyle={{color: theme.gray_500}}
              />
            )}
          </View>
          <StyleTouchable
            onPress={() => {
              ModalInputEdit.show({
                defaultValue: bankAccount,
                onSave: value => setBankAccount(value),
                keyboardType: 'numeric',
                placeholder: 'profile.accountNumber',
              });
            }}>
            <StyleText
              i18Text="profile.post.edit"
              customStyle={[styles.textEdit, {color: theme.p_900}]}
            />
          </StyleTouchable>
        </View>

        {renderUpdateBefore()}
      </StyleContainer>

      <ModalChooseBank
        ref={modalChooseBankRef}
        bank={chosenBank}
        onChangeBank={value => {
          setChosenBank(value);
          setBankAccount('');
        }}
        theme={theme}
      />
    </>
  );
};

const styles = ScaledSheet.create({
  titleChooseBank: {
    fontWeight: 'bold',
    marginTop: '10@vs',
  },
  titleAccountNumber: {
    fontWeight: 'bold',
    marginTop: '20@vs',
  },
  infoView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10@vs',
  },
  infoBox: {
    minWidth: '100@s',
    maxWidth: '70%',
    paddingVertical: '5@vs',
    borderWidth: borderWidthTiny,
    borderRadius: '5@ms',
    alignItems: 'center',
    paddingHorizontal: '5@s',
  },
  textEdit: {
    fontSize: FONT_SIZE.f3,
    marginLeft: '10@s',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    marginVertical: '10@vs',
  },
  logoBank: {
    width: '100@s',
    height: scale((311 / 831) * 100),
  },
});

const $preViewUpdate: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(20),
};
const $textUpdateBefore: TextStyle = {
  fontWeight: 'bold',
  fontSize: FONT_SIZE.f1,
};
const $textBankCode: TextStyle = {
  fontWeight: 'bold',
};

export default UpdateBankAccount;
