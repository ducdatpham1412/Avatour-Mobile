import {useIsFocused} from '@react-navigation/native';
import {apiChangeInformation} from 'api/setting';
import {updatePassport} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {LoadingScreen} from 'components';
import {StyleContainer} from 'components/base';
import {useLoading, useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {SETTING_ROUTE} from 'navigation/config/routes';
import {
  ModalActionSheet,
  ModalAlert,
  ModalDatePicker,
  ModalInputEdit,
} from 'navigation/screen/modals';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextStyle, ViewStyle} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useUpdateEffect} from 'react-use';
import {
  chooseTextFromIdGender,
  listGenders,
  removePrefixPhone,
} from 'utility/assistant';
import {
  formatDateDayMonthYear,
  formatPhone,
  formatUTCDate,
  isTimeEqual,
} from 'utility/format';
import {moderateScale, scale} from 'utility/scale';
import {validateIsEmail, validateIsPhone} from 'utility/validate';
import ItemInfo from './ItemInfo';

const PersonalInformation = () => {
  const {t} = useTranslation();
  const {profile} = useAppSelector(state => state.accountSlice.passport);
  const theme = useTheme();
  const isFocused = useIsFocused();
  const {loading, setLoading} = useLoading();

  const informationValueRef = useRef({
    ...profile.information,
    gender: profile.gender,
    birthday: profile.birthday,
  });
  const timeOut = useRef<NodeJS.Timeout>();

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
        setLoading(true);
        await apiChangeInformation({
          gender: newInfo.gender,
        });
        updatePassport({
          profile: {
            gender: newInfo.gender,
          },
        });
        ModalAlert.success({
          i18Content: 'alert.successChange',
        });
        return;
      }
      if (newInfo.birthday) {
        setLoading(true);
        await apiChangeInformation({
          birthday: newInfo.birthday,
        });
        updatePassport({
          profile: {
            birthday: newInfo.birthday,
          },
        });
        ModalAlert.success({
          i18Content: 'alert.successChange',
        });
        return;
      }
      if (newInfo.email) {
        navigate(SETTING_ROUTE.enterPassword, {
          newInfo,
          mode: 'change-information',
        });
        return;
      }
      if (newInfo.phone) {
        navigate(SETTING_ROUTE.enterPassword, {
          newInfo,
          mode: 'change-information',
        });
      }
    } catch (err) {
      refuseChange();
    } finally {
      setLoading(false);
    }
  };

  const openConfirmChange = async (newInfo: any) => {
    ModalAlert.options({
      i18Content: 'setting.personalInfo.alertCfChange',
      onCancel: refuseChange,
      onContinue: () => agreeChange(newInfo),
    });
  };

  useUpdateEffect(() => {
    if (email !== informationValueRef.current.email) {
      timeOut.current = setTimeout(() => {
        openConfirmChange({email});
      }, 400);
      return;
    }
    if (phone !== informationValueRef.current.phone) {
      timeOut.current = setTimeout(() => {
        openConfirmChange({phone});
      }, 400);
      return;
    }
    if (gender !== informationValueRef.current.gender) {
      openConfirmChange({gender});
      return;
    }
    if (!isTimeEqual(birthday, informationValueRef.current.birthday)) {
      timeOut.current = setTimeout(() => {
        openConfirmChange({birthday});
      }, 400);
    }

    return () => clearTimeout(timeOut.current);
  }, [email, phone, gender, birthday]);

  useUpdateEffect(() => {
    if (isFocused) {
      refuseChange();
    }
  }, [isFocused]);

  useEffect(() => {
    informationValueRef.current = {
      ...profile.information,
      gender: profile.gender,
      birthday: profile.birthday,
    };
  }, [profile]);

  return (
    <>
      <StyleContainer
        headerProps={{title: 'setting.personalInfo.headerTitle'}}
        customStyle={$container}
        backgroundColor={theme.background}>
        <ItemInfo
          value={email}
          icon={<Entypo name="email" style={[$icon, {color: theme.blue}]} />}
          onPressEdit={() =>
            ModalInputEdit.show({
              defaultValue: email,
              checkEnableButton: value => validateIsEmail(value),
              placeholder: 'login.email',
              onSave: value => setEmail(value),
            })
          }
        />

        <ItemInfo
          value={formatPhone(phone)}
          icon={<Feather name="phone" style={[$icon, {color: theme.blue}]} />}
          onPressEdit={() =>
            ModalInputEdit.show({
              defaultValue: formatPhone(phone),
              validateInput: text => text.includes('(+84) '),
              checkEnableButton: text =>
                validateIsPhone(removePrefixPhone(text)),
              placeholder: 'login.phone',
              onSave: value => setPhone(removePrefixPhone(value)),
              keyboardType: 'numeric',
            })
          }
        />

        <ItemInfo
          value={t(chooseTextFromIdGender(gender))}
          icon={<Feather name="user" style={[$icon, {color: theme.blue}]} />}
          onPressEdit={() => {
            ModalActionSheet.show({
              options: listGenders.map(value => ({
                title: value.name,
                onPress: () => setGender(value.id),
              })),
            });
          }}
        />

        <ItemInfo
          value={formatDateDayMonthYear(birthday)}
          icon={
            <FontAwesome
              name="birthday-cake"
              style={[$iconBirthday, {color: theme.blue}]}
            />
          }
          onPressEdit={() =>
            ModalDatePicker.show({
              date: birthday ?? String(new Date()),
              onChangeRange: value => setBirthday(formatUTCDate(value.date)),
              validRange: {
                endDate: new Date(),
                startDate: undefined,
              },
            })
          }
        />
      </StyleContainer>

      {loading && <LoadingScreen />}
    </>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: scale(20),
};
const $icon: TextStyle = {
  fontSize: moderateScale(18),
};
const $iconBirthday: TextStyle = {
  fontSize: moderateScale(15),
};

export default PersonalInformation;
