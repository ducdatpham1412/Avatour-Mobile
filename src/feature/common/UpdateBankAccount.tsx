import {apiUpdateBankAccount} from 'api/authentication';
import {TypeGetRequestResponse} from 'api/interface';
import {useAppSelector} from 'app-redux/store';
import {TYPE_AUTH_REQUEST} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {
  StyleButton,
  StyleContainer,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useMyRequests} from 'feature/profile/hooks';
import {useLoading, useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import {ModalAlert, ModalInputEdit} from 'navigation/screen/modals';
import React, {useEffect, useRef, useState} from 'react';
import {ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale} from 'react-native-size-matters';
import {borderWidthTiny, logger} from 'utility/assistant';
import {moderateScale, verticalScale} from 'utility/scale';
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
  const [{data: listRequests}] = useMyRequests();
  const updateBankData: TypeGetRequestResponse<'update_bank'> | undefined =
    listRequests.find(item => item.type === TYPE_AUTH_REQUEST.update_bank);

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
          ModalAlert.error({
            content: err,
          });
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
    if (!updateBankData) {
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
            originValue={updateBankData.data.bank_code}
            customStyle={$textBankCode}
          />
        </StyleText>
        <StyleText originValue="・">
          <StyleText i18Text="profile.accountNumber" />
          <StyleText originValue=": " />
          <StyleText
            originValue={updateBankData.data.bank_account}
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
        backgroundColor={theme.white}
        customStyle={$container}>
        <StyleText i18Text="profile.bank" customStyle={$titleChooseBank} />
        <View style={$infoView}>
          <View style={[$infoBox, {borderColor: theme.gray_500}]}>
            {chosenBank ? (
              <StyleImage
                source={{uri: chosenBank.logo}}
                customStyle={$logoBank}
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
              i18Text="common.edit"
              customStyle={[$textEdit, {color: theme.p_900}]}
            />
          </StyleTouchable>
        </View>

        <StyleText
          i18Text="profile.accountNumber"
          customStyle={$titleAccountNumber}
        />
        <View style={$infoView}>
          <View style={[$infoBox, {borderColor: theme.gray_500}]}>
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
              i18Text="common.edit"
              customStyle={[$textEdit, {color: theme.p_900}]}
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

const $infoBox: ViewStyle = {
  minWidth: scale(100),
  maxWidth: '70%',
  paddingVertical: verticalScale(4),
  borderWidth: borderWidthTiny,
  borderRadius: moderateScale(5),
  alignItems: 'center',
  paddingHorizontal: scale(5),
};
const $infoView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(10),
};
const $titleChooseBank: TextStyle = {
  fontWeight: 'bold',
  marginTop: verticalScale(12),
};
const $logoBank: ImageStyle = {
  width: scale(100),
  height: scale((311 / 831) * 100),
};
const $textEdit: TextStyle = {
  fontSize: FONT_SIZE.f3,
  marginLeft: scale(12),
  textDecorationLine: 'underline',
  fontWeight: 'bold',
  marginVertical: verticalScale(12),
};
const $container: ViewStyle = {
  paddingHorizontal: scale(32),
};
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
const $titleAccountNumber: TextStyle = {
  fontWeight: 'bold',
  marginTop: verticalScale(20),
};

export default UpdateBankAccount;
