import {apiUpgradeAccount} from 'api/authentication';
import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_WEIGHT_MEDIUM} from 'asset';
import AutoHeightImage from 'components/AutoHeightImage';
import {
  StyleButton,
  StyleContainer,
  StyleText,
  StyleTouchable,
} from 'components/base';
import InputBox from 'components/common/InputBox';
import {useMyRequests} from 'feature/profile/hooks';
import {useLoading, useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import {ModalAlert, ModalInputEdit} from 'navigation/screen/modals';
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, TextInput, TextStyle, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {borderWidthTiny} from 'utility/assistant';
import {verticalScale} from 'utility/scale';
import {validateIsPhone} from 'utility/validate';
import ModalBankAccount from './components/ModalBankAccount';
import ModalChooseBank from './components/ModalChooseBank';
import {checkAuthenticated} from 'navigation/screen/AppModal';

const UpgradeAccount = () => {
  const timeOutRef = useRef<NodeJS.Timeout>();
  const {loading, setLoading} = useLoading();
  const theme = useTheme();
  const {email} = useAppSelector(
    state => state.accountSlice.passport.profile.information,
  );
  const [, {mutate}] = useMyRequests();

  const scrollRef = useRef<ScrollView>(null);
  const nameRef = useRef<TextInput>(null);
  const locationInputRef = useRef<TextInput>(null);
  const phoneNumberRef = useRef<TextInput>(null);
  const modalChooseBankRef = useRef<ModalChooseBank>(null);
  const modalBankAccountRef = useRef<ModalBankAccount>(null);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [chosenBank, setChosenBank] = useState<any>();
  const [bankAccount, setBankAccount] = useState('');

  const [height, setHeight] = useState(0);

  useEffect(() => {
    return () => {
      clearTimeout(timeOutRef.current);
    };
  }, []);

  const onConfirm = () => {
    checkAuthenticated({
      onAuthenticated: async () => {
        try {
          setLoading(true);
          await apiUpgradeAccount({
            name,
            location,
            phone,
            bank_code: chosenBank?.code || chosenBank?.shortName || '',
            bank_account: bankAccount,
          });
          await mutate();
          ModalAlert.success({
            i18Content: 'profile.requestUpgradeSuccess',
            onClose: () => goBack(),
          });
        } catch (err) {
          ModalAlert.error({
            content: err,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  /**
   * Render views
   */
  const renderHeader = () => {
    return (
      <View style={[$element, {height}]}>
        <StyleText i18Text="profile.toBecomeShopAccount" customStyle={$title} />
        <StyleButton
          title="common.next"
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: height,
              animated: true,
            });
            if (!location) {
              timeOutRef.current = setTimeout(() => {
                nameRef.current?.focus();
              }, 400);
            }
          }}
          containerStyle={$button}
        />
      </View>
    );
  };

  const renderEnterName = () => {
    return (
      <View style={[$element, {height}]}>
        <StyleText i18Text="profile.firstEnterName" customStyle={$title} />
        <InputBox
          ref={nameRef}
          style={[$input, {backgroundColor: theme.white}]}
          i18Placeholder="profile.shopName"
          defaultValue={name}
          onChangeText={text => setName(text)}
        />
        <StyleButton
          title="common.next"
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: height * 2,
              animated: true,
            });
            if (!location) {
              timeOutRef.current = setTimeout(() => {
                locationInputRef.current?.focus();
              }, 400);
            }
          }}
          containerStyle={$button}
          disable={!name}
        />
      </View>
    );
  };

  const enterLocation = () => {
    return (
      <View style={[$element, {height}]}>
        <StyleText i18Text="profile.shopLocation" customStyle={$title} />
        <InputBox
          ref={locationInputRef}
          style={[$input, {backgroundColor: theme.white}]}
          i18Placeholder="profile.address"
          defaultValue={location}
          onChangeText={text => setLocation(text)}
        />
        <StyleButton
          title="common.next"
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: height * 3,
              animated: true,
            });
            if (!phone) {
              timeOutRef.current = setTimeout(() => {
                phoneNumberRef.current?.focus();
              }, 400);
            }
          }}
          containerStyle={$button}
          disable={!location}
        />
      </View>
    );
  };

  const enterPhoneNumber = () => {
    return (
      <View style={[$element, {height}]}>
        <StyleText i18Text="profile.phoneNumber" customStyle={$title} />
        <InputBox
          ref={phoneNumberRef}
          style={[$input, {backgroundColor: theme.white}]}
          i18Placeholder="profile.phoneNumber"
          defaultValue={phone}
          onChangeText={text => setPhone(text)}
          keyboardType="numeric"
        />
        <StyleButton
          title="common.next"
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: height * 4,
              animated: true,
            });
          }}
          containerStyle={$button}
          disable={!validateIsPhone(phone)}
        />
      </View>
    );
  };

  const chooseBanking = () => {
    return (
      <View style={[$element, {height}]}>
        <StyleText i18Text="profile.updateBankAccount" customStyle={$title} />
        <StyleText i18Text="profile.thisIsAccountReceive" />

        {!chosenBank ? (
          <StyleTouchable
            customStyle={[
              $chooseBank,
              {borderColor: theme.black, marginTop: verticalScale(30)},
            ]}
            onPress={() => modalChooseBankRef.current?.show()}>
            <StyleText i18Text="profile.bank" />
          </StyleTouchable>
        ) : (
          <StyleTouchable onPress={() => modalChooseBankRef.current?.show()}>
            <AutoHeightImage
              uri={chosenBank?.logo || ''}
              customStyle={styles.iconChosenBank}
            />
          </StyleTouchable>
        )}

        <View style={styles.accountNumberView}>
          <StyleTouchable
            customStyle={$chooseBank}
            onPress={() =>
              ModalInputEdit.show({
                defaultValue: bankAccount,
                placeholder: 'profile.accountNumber',
                onSave: text => setBankAccount(text),
              })
            }>
            {!bankAccount ? (
              <StyleText i18Text="profile.accountNumber" />
            ) : (
              <StyleText originValue={bankAccount} />
            )}
          </StyleTouchable>
        </View>

        <StyleButton
          title="common.done"
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: height * 5,
              animated: true,
            });
          }}
          containerStyle={$button}
          disable={!chosenBank || !bankAccount}
        />
      </View>
    );
  };

  const confirmAll = () => {
    return (
      <View style={[$element, {height}]}>
        <StyleText
          i18Text="profile.agreeSendInformation"
          i18Params={{
            email,
          }}
          mode="html"
          customStyle={[$title, {fontWeight: 'normal'}]}
        />
        <StyleButton
          title="setting.personalInfo.confirm"
          onPress={onConfirm}
          containerStyle={$button}
          disable={!name || !location || !phone || !chosenBank || !bankAccount}
          isLoading={loading}
        />
      </View>
    );
  };

  return (
    <StyleContainer
      headerProps={{
        title: 'profile.upgradeToShop',
      }}
      layOut="view">
      <View
        style={$container}
        onLayout={({nativeEvent}) => {
          setHeight(nativeEvent.layout.height);
        }}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={height}
          decelerationRate="fast">
          {renderHeader()}
          {renderEnterName()}
          {enterLocation()}
          {enterPhoneNumber()}
          {chooseBanking()}
          {confirmAll()}
        </ScrollView>
      </View>

      <ModalChooseBank
        ref={modalChooseBankRef}
        bank={chosenBank}
        onChangeBank={value => setChosenBank(value)}
        theme={theme}
      />
      <ModalBankAccount
        ref={modalBankAccountRef}
        value={bankAccount}
        onChangeValue={value => setBankAccount(value)}
        theme={theme}
      />
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $element: ViewStyle = {
  width: '100%',
  justifyContent: 'center',
  marginTop: -verticalScale(20),
};
const $title: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $input: TextStyle = {
  width: '100%',
  marginTop: verticalScale(12),
};
const $button: ViewStyle = {
  marginTop: verticalScale(26),
};
const $chooseBank: ViewStyle = {
  width: '70%',
  alignSelf: 'center',
  borderRadius: BORDER_RADIUS.f3,
  borderWidth: borderWidthTiny,
  paddingVertical: verticalScale(8),
  alignItems: 'center',
};

const styles = ScaledSheet.create({
  iconChosenBank: {
    width: '30%',
    borderRadius: '10@ms',
    alignSelf: 'center',
  },
  accountNumberView: {
    width: '100%',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  titleConfirm: {
    lineHeight: '20@ms',
  },
});

export default UpgradeAccount;
