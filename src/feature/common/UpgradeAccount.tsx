import {apiUpgradeAccount} from 'api/authentication';
import {useAppSelector} from 'app-redux/store';
import {Metrics} from 'asset/metrics';
import AutoHeightImage from 'components/AutoHeightImage';
import {StyleButton, StyleText, StyleTouchable} from 'components/base';
import InputBox from 'components/common/InputBox';
import {useLoading, useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import {StyleHeader} from 'navigation/components';
import {ModalAlert, ModalInputEdit} from 'navigation/screen/modals';
import React, {useRef, useState} from 'react';
import {ScrollView, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import {borderWidthTiny} from 'utility/assistant';
import {verticalScale} from 'utility/scale';
import {validateIsPhone} from 'utility/validate';
import ModalBankAccount from './components/ModalBankAccount';
import ModalChooseBank from './components/ModalChooseBank';

const {width, height} = Metrics;

const UpgradeAccount = () => {
  const {top} = useSafeAreaInsets();
  const {loading, setLoading} = useLoading();
  const theme = useTheme();
  const {email} = useAppSelector(
    state => state.accountSlice.passport.profile.information,
  );

  const scrollRef = useRef<ScrollView>(null);
  const locationInputRef = useRef<TextInput>(null);
  const phoneNumberRef = useRef<TextInput>(null);
  const modalChooseBankRef = useRef<ModalChooseBank>(null);
  const modalBankAccountRef = useRef<ModalBankAccount>(null);

  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [chosenBank, setChosenBank] = useState<any>();
  const [bankAccount, setBankAccount] = useState('');

  const onConfirm = async () => {
    try {
      setLoading(true);
      await apiUpgradeAccount({
        location,
        phone,
        bank_code: chosenBank?.code || chosenBank?.shortName || '',
        bank_account: bankAccount,
      });
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
  };

  const renderHeader = () => {
    return (
      <View style={styles.elementView}>
        <StyleText
          i18Text="profile.toBecomeShopAccount"
          customStyle={styles.titleBecome}
        />
        <StyleButton
          title="common.next"
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: height,
              animated: true,
            });
            if (!location) {
              locationInputRef.current?.focus();
            }
          }}
          containerStyle={styles.buttonView}
        />
      </View>
    );
  };

  const enterLocation = () => {
    return (
      <View style={styles.elementView}>
        <StyleText
          i18Text="profile.firstEnterLocation"
          customStyle={styles.titleBecome}
        />
        <InputBox
          ref={locationInputRef}
          style={[styles.inputContainer, {backgroundColor: theme.background}]}
          i18Placeholder="profile.location"
          defaultValue={location}
          onChangeText={text => setLocation(text)}
        />
        <StyleButton
          title="common.next"
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: height * 2,
              animated: true,
            });
            if (!phone) {
              phoneNumberRef.current?.focus();
            }
          }}
          containerStyle={styles.buttonView}
          disable={!location}
        />
      </View>
    );
  };

  const enterPhoneNumber = () => {
    return (
      <View style={styles.elementView}>
        <StyleText
          i18Text="profile.phoneNumber"
          customStyle={styles.titleBecome}
        />
        <InputBox
          ref={phoneNumberRef}
          style={[styles.inputContainer, {backgroundColor: theme.background}]}
          i18Placeholder="profile.phoneNumber"
          defaultValue={phone}
          onChangeText={text => setPhone(text)}
          keyboardType="numeric"
        />
        <StyleButton
          title="common.next"
          onPress={() => {
            scrollRef.current?.scrollTo({
              y: height * 3,
              animated: true,
            });
          }}
          containerStyle={styles.buttonView}
          disable={!validateIsPhone(phone)}
        />
      </View>
    );
  };

  const chooseBanking = () => {
    return (
      <View style={styles.elementView}>
        <StyleText
          i18Text="profile.updateBankAccount"
          customStyle={styles.titleBecome}
        />
        <StyleText i18Text="profile.thisIsAccountReceive" />

        {!chosenBank ? (
          <StyleTouchable
            customStyle={[
              styles.chooseBankBox,
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
            customStyle={styles.chooseBankBox}
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
              y: height * 4,
              animated: true,
            });
          }}
          containerStyle={styles.buttonView}
          disable={!chosenBank || !bankAccount}
        />
      </View>
    );
  };

  const confirmAll = () => {
    return (
      <View style={styles.elementView}>
        <StyleText
          i18Text="profile.byTapping"
          customStyle={styles.titleConfirm}>
          <StyleText
            i18Text="setting.personalInfo.confirm"
            customStyle={[styles.titleConfirm, {fontWeight: 'bold'}]}
          />
          <StyleText
            i18Text="profile.agreeSendTheseInformation"
            customStyle={styles.titleConfirm}
          />
          <StyleText
            originValue={email}
            customStyle={[styles.titleConfirm, {fontWeight: 'bold'}]}
          />
        </StyleText>
        <StyleButton
          title="setting.personalInfo.confirm"
          onPress={onConfirm}
          containerStyle={styles.buttonView}
          disable={!location || !phone || !chosenBank || !bankAccount}
          isLoading={loading}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.white}]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast">
        {renderHeader()}
        {enterLocation()}
        {enterPhoneNumber()}
        {chooseBanking()}
        {confirmAll()}
      </ScrollView>

      <View
        style={[
          styles.header,
          {paddingTop: top, backgroundColor: theme.white},
        ]}>
        <StyleHeader
          containerStyle={{backgroundColor: theme.white}}
          title="profile.upgradeToShop"
        />
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
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    position: 'absolute',
  },
  buttonBack: {
    position: 'absolute',
    left: '20@s',
  },
  imageBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  elementView: {
    width,
    height,
    justifyContent: 'center',
    paddingHorizontal: '20@s',
  },
  titleBecome: {
    lineHeight: '20@ms',
    fontWeight: 'bold',
  },
  buttonView: {
    marginTop: '30@vs',
  },
  inputContainer: {
    width: '100%',
    marginTop: '15@vs',
  },
  chooseBankBox: {
    paddingVertical: '10@vs',
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    borderRadius: '10@ms',
    borderWidth: borderWidthTiny,
  },
  iconChosenBank: {
    width: '30%',
    borderRadius: '10@ms',
    alignSelf: 'center',
  },
  accountNumberView: {
    width: '100%',
    alignItems: 'center',
    marginTop: '20@vs',
  },
  titleConfirm: {
    lineHeight: '20@ms',
  },
});

export default UpgradeAccount;
