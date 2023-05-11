/* eslint-disable no-underscore-dangle */
import {apiChangeInformation} from 'api/setting';
import {updatePassport} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {StyleContainer, StyleText} from 'components/base';
import {useTheme} from 'hook';
import {goBack, navigate, popUpPicker} from 'navigation/NavigationService';
import {SETTING_ROUTE} from 'navigation/config/routes';
import {
  ModalAlert,
  ModalDatePicker,
  ModalInputEdit,
} from 'navigation/screen/modals';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextStyle, View, ViewStyle} from 'react-native';
import {verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useUpdateEffect} from 'react-use';
import {chooseTextFromIdGender, renderListGender} from 'utility/assistant';
import {
  formatDateDayMonthYear,
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

  const informationValueRef = useRef({
    ...profile.information,
    gender: profile.gender,
    birthday: profile.birthday,
  });

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

  useUpdateEffect(() => {
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
    informationValueRef.current = {
      ...profile.information,
      gender: profile.gender,
      birthday: profile.birthday,
    };
  }, [profile.information]);

  const onNavigateGenderPicker = () => {
    popUpPicker({
      data: renderListGender,
      renderItem: (item: any) => (
        <View style={$elementPicker}>
          <StyleText
            i18Text={item.name}
            customStyle={[$textPicker, {color: theme.textColor}]}
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
    <StyleContainer
      headerProps={{title: 'setting.personalInfo.headerTitle'}}
      backgroundColor={theme.white}
      customStyle={$container}>
      <ItemInfo
        value={email}
        icon={<Entypo name="email" style={[$icon, {color: theme.blue}]} />}
        onPressEdit={() =>
          ModalInputEdit.show({
            defaultValue: email,
            checkValid: value => validateIsEmail(value),
            placeholder: 'login.email',
            onSave: value => setEmail(value),
          })
        }
      />

      <ItemInfo
        value={phone}
        icon={<Feather name="phone" style={[$icon, {color: theme.blue}]} />}
        onPressEdit={() =>
          ModalInputEdit.show({
            defaultValue: phone,
            checkValid: value => validateIsPhone(value),
            placeholder: 'login.signUp.type.phone',
            onSave: value => setPhone(value),
            keyboardType: 'numeric',
          })
        }
      />

      <ItemInfo
        value={t(chooseTextFromIdGender(gender))}
        icon={<Feather name="user" style={[$icon, {color: theme.blue}]} />}
        onPressEdit={onNavigateGenderPicker}
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
const $elementPicker: ViewStyle = {
  height: verticalScale(50),
  justifyContent: 'center',
};
const $textPicker: TextStyle = {
  fontWeight: 'bold',
  fontSize: moderateScale(20),
};

export default PersonalInformation;
