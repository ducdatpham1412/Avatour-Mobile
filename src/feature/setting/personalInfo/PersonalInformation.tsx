/* eslint-disable no-underscore-dangle */
import {apiChangeInformation} from 'api/setting';
import {updatePassport} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {StyleContainer, StyleText} from 'components/base';
import ClassDateTimePicker from 'components/base/picker/ClassDateTimePicker';
import {useTheme} from 'hook';
import {goBack, navigate, popUpPicker} from 'navigation/NavigationService';
import StyleHeader from 'navigation/components/StyleHeader';
import {SETTING_ROUTE} from 'navigation/config/routes';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {chooseTextFromIdGender, renderListGender} from 'utility/assistant';
import {
  formatDateDayMonthYear,
  formatUTCDate,
  isTimeEqual,
} from 'utility/format';
import ItemInfo from './ItemInfo';
import ModalChangeEmail from './components/ModalChangeEmail';
import ModalChangePhone from './components/ModalChangePhone';

const PersonalInformation = () => {
  const {t} = useTranslation();
  const {profile} = useAppSelector(state => state.accountSlice.passport);
  const theme = useTheme();

  const emailRef = useRef<ModalChangeEmail>(null);
  const phoneRef = useRef<ModalChangePhone>(null);
  const birthdayRef = useRef<ClassDateTimePicker>(null);
  const informationValueRef = useRef<any>(profile.information);

  const [email, setEmail] = useState(profile.information.email);
  const [phone, setPhone] = useState(profile.information.phone);
  const [gender, setGender] = useState(profile.gender);
  const [birthday, setBirthday] = useState(formatUTCDate(profile.birthday));

  const refuseChange = () => {
    setEmail(informationValueRef.current.email);
    setPhone(informationValueRef.current.phone);
    setGender(informationValueRef.current.gender);
    setBirthday(informationValueRef.current.birthday);
  };

  const agreeChange = async (newInfo: any) => {
    try {
      if (newInfo.gender !== undefined) {
        await apiChangeInformation({
          gender: newInfo.gender,
        });
        updatePassport({
          profile: {
            information: newInfo,
          },
        });
        goBack();
        return;
      }
      if (newInfo.birthday) {
        await apiChangeInformation({
          birthday: newInfo.birthday,
        });
        updatePassport({
          profile: {
            information: newInfo,
          },
        });
        goBack();
        return;
      }
      if (newInfo.email) {
        navigate(SETTING_ROUTE.enterPassword, {
          newInfo,
        });
        return;
      }
      if (newInfo.phone) {
        navigate(SETTING_ROUTE.enterPassword, {
          newInfo,
        });
      }
    } catch (err) {
      refuseChange();
    }
  };

  const openConfirmChange = async (newInfo: any) => {
    ModalAlert.options({
      i18Content: 'setting.personalInfo.alertCfChange',
      onCancel: refuseChange,
      onContinue: () => agreeChange(newInfo),
    });
  };

  useEffect(() => {
    if (email !== informationValueRef.current.email) {
      openConfirmChange({email});
      return;
    }
    if (phone !== informationValueRef.current.phone) {
      openConfirmChange({phone});
      return;
    }
    if (gender !== informationValueRef.current.gender) {
      openConfirmChange({gender});
    }
    if (!isTimeEqual(birthday, informationValueRef.current.birthday)) {
      openConfirmChange({birthday});
    }
  }, [email, phone, gender, birthday]);

  useEffect(() => {
    informationValueRef.current = profile.information;
  }, [profile.information]);

  const onNavigateGenderPicker = () => {
    popUpPicker({
      data: renderListGender,
      renderItem: (item: any) => (
        <View style={styles.elementPicker}>
          <StyleText
            i18Text={item.name}
            customStyle={[styles.textPicker, {color: theme.textColor}]}
          />
        </View>
      ),
      itemHeight: verticalScale(50),
      onSetItemSelected: (value: any) => {
        setGender(value.id);
      },
      initIndex: renderListGender.findIndex(item => item.id === gender) || 0,
    });
  };

  return (
    <>
      <StyleHeader title="setting.personalInfo.headerTitle" />

      <StyleContainer customStyle={styles.container}>
        <ItemInfo
          value={email}
          icon={
            <Entypo
              name="email"
              style={[styles.icon, {color: theme.borderColor}]}
            />
          }
          onPressEdit={() => emailRef.current?.show()}
        />

        <ItemInfo
          value={phone}
          icon={
            <Feather
              name="phone"
              style={[styles.icon, {color: theme.borderColor}]}
            />
          }
          onPressEdit={() => phoneRef.current?.show()}
        />

        <ItemInfo
          value={t(chooseTextFromIdGender(gender))}
          icon={
            <Feather
              name="user"
              style={[styles.icon, {color: theme.borderColor}]}
            />
          }
          onPressEdit={onNavigateGenderPicker}
        />

        <ItemInfo
          value={formatDateDayMonthYear(birthday)}
          icon={
            <FontAwesome
              name="birthday-cake"
              style={[styles.iconBirthday, {color: theme.borderColor}]}
            />
          }
          onPressEdit={() => birthdayRef.current?.show()}
        />
      </StyleContainer>

      <ModalChangeEmail
        ref={emailRef}
        email={email}
        onChangeEmail={value => setEmail(value)}
        theme={theme}
      />

      <ModalChangePhone
        ref={phoneRef}
        phone={phone}
        onChangePhone={value => setPhone(value)}
        theme={theme}
      />

      <ClassDateTimePicker
        ref={birthdayRef}
        initDate={new Date(birthday)}
        onChangeDateTime={value => setBirthday(formatUTCDate(value))}
        theme={theme}
      />
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    paddingHorizontal: '10@vs',
  },
  icon: {
    fontSize: '18@ms',
  },
  iconBirthday: {
    fontSize: '15@ms',
  },
  elementPicker: {
    height: '50@vs',
    justifyContent: 'center',
  },
  textPicker: {
    fontWeight: 'bold',
    fontSize: '20@ms',
  },
});

export default PersonalInformation;
