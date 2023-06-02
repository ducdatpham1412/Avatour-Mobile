import {apiChangeInformation} from 'api/setting';
import {GENDER_TYPE} from 'asset/enum';
import {BORDER_RADIUS, scrollItemHeight} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
  StyleButton,
  StyleContainer,
  StyleList,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {CircleButton} from 'components/common';
import InputBox from 'components/common/InputBox';
import {useLoading, useTheme} from 'hook';
import {AppParamsList, LOGIN_ROUTE} from 'navigation/config';
import {ModalAlert, ModalDatePicker} from 'navigation/screen/modals';
import React, {useRef, useState} from 'react';
import {FlatList, TextInput, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useUpdateEffect} from 'react-use';
import {I18Normalize} from 'utility/I18Next';
import {isIOS} from 'utility/assistant';
import AsyncStore from 'utility/asyncStore';
import {formatDateDayMonthYear, formatUTCDate} from 'utility/format';
import AuthenticateService from 'utility/login/loginService';
import {moderateScale} from 'utility/scale';
import GenderSwipe from '../components/GenderSwipe';
import {impactLight} from 'utility/haptic';

const defaultDate = new Date(2000, 0, 1);

const EditBasicInformation = ({
  route,
}: RouteParams<AppParamsList[LOGIN_ROUTE.editBasicInformation]>) => {
  const {isLoginSocial = false, itemLoginSuccess} = route?.params ?? {};
  const theme = useTheme();
  const {loading, setLoading} = useLoading();

  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const [gender, setGender] = useState(GENDER_TYPE.woman);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [index, setIndex] = useState(0);

  const textBirthday = birthday
    ? formatDateDayMonthYear(birthday)
    : 'login.detailInformation.chooseBirthday';
  const titleButton = index === 2 ? 'common.done' : 'common.next';
  let disableButton = false;
  if (index === 1) {
    disableButton = !name;
  } else if (index === 2) {
    disableButton = !birthday;
  }

  const onPressButton = () => {
    if (index < 2) {
      setIndex(index + 1);
    } else if (birthday && name) {
      const onEditProfileAndGo = async (isKeep: boolean) => {
        try {
          setLoading(true);
          const updateObject = {
            gender,
            name,
            birthday: formatUTCDate(birthday),
          };
          /**
           * Have to update active user first
           * In order to set token for "apiChangeInformation" later
           */
          await AsyncStore.updateActiveUser(itemLoginSuccess);
          await apiChangeInformation(updateObject);
          await AuthenticateService.loginSuccess({
            itemLoginSuccess,
            isKeepSign: isKeep,
            isLoginSocial,
          });
        } catch (err) {
          await AsyncStore.logOut();
          ModalAlert.error({
            content: err,
          });
        } finally {
          setLoading(false);
        }
      };

      if (isLoginSocial) {
        onEditProfileAndGo(true);
      } else {
        ModalAlert.options({
          i18Content: 'alert.wantToSave',
          onContinue: () => onEditProfileAndGo(true),
          onCancel: () => onEditProfileAndGo(false),
        });
      }
    }
  };

  useUpdateEffect(() => {
    if (index >= 0 && index <= 2) {
      impactLight();
      flatListRef.current?.scrollToIndex({
        index: index,
        animated: true,
      });
    }
    if (index === 1) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [index]);

  return (
    <StyleContainer
      extraHeight={50}
      headerProps={{
        LeftComponent: null,
        title: 'login.detailInformation.title',
      }}>
      <View style={[styles.pickerView, {backgroundColor: theme.white}]}>
        <StyleList
          ref={flatListRef}
          data={[0, 1, 2]}
          renderItem={({item}) => {
            if (item === 0) {
              return <GenderSwipe gender={gender} setGender={setGender} />;
            }
            if (item === 1) {
              return (
                <View style={styles.pickerBox}>
                  <StyleText i18Text="login.detailInformation.enterYourName" />
                  <InputBox
                    ref={inputRef}
                    value={name}
                    onChangeText={text => setName(text)}
                    style={{
                      marginTop: verticalScale(12),
                      backgroundColor: theme.background,
                    }}
                    i18Placeholder="profile.edit.name"
                    onSubmitEditing={onPressButton}
                  />
                </View>
              );
            }
            if (item === 2) {
              return (
                <View style={styles.pickerBox}>
                  <StyleTouchable
                    hitSlop={20}
                    onPress={() => {
                      ModalDatePicker.show({
                        date: String(birthday ?? defaultDate),
                        onChangeRange(value) {
                          setBirthday(value.date);
                        },
                      });
                    }}>
                    <StyleText
                      i18Text={textBirthday as I18Normalize}
                      customStyle={
                        birthday
                          ? styles.textBirthday
                          : styles.textChooseBirthday
                      }
                    />
                  </StyleTouchable>
                </View>
              );
            }
            return null;
          }}
          keyExtractor={(_, __index) => String(__index)}
          snapToInterval={scrollItemHeight}
          onEndReachedThreshold={40}
          decelerationRate={isIOS ? 0.1 : 0.75}
          scrollEnabled={false}
        />

        {index > 0 && (
          <CircleButton
            icon={
              <AntDesign
                name="up"
                style={{fontSize: moderateScale(20), color: theme.gray_700}}
              />
            }
            containerStyle={styles.buttonUp}
            onPress={() => {
              if (index > 0) {
                setIndex(pre => pre - 1);
              }
            }}
            disable={disableButton}
          />
        )}

        {index < 2 && (
          <CircleButton
            icon={
              <AntDesign
                name="down"
                style={{fontSize: moderateScale(20), color: theme.gray_700}}
              />
            }
            containerStyle={styles.buttonDown}
            onPress={() => {
              if (index < 2) {
                setIndex(pre => pre + 1);
              }
            }}
            disable={disableButton}
          />
        )}
      </View>

      <StyleButton
        title={titleButton}
        onPress={onPressButton}
        containerStyle={{marginTop: verticalScale(80)}}
        disable={disableButton}
        isLoading={loading}
      />
    </StyleContainer>
  );
};

const styles = ScaledSheet.create({
  buttonUp: {
    position: 'absolute',
    alignSelf: 'center',
    top: '5@vs',
  },
  iconUp: {
    fontSize: '20@ms',
  },
  buttonDown: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '5@vs',
  },
  pickerView: {
    width: '80%',
    height: scrollItemHeight,
    alignSelf: 'center',
    marginTop: '28@vs',
    borderRadius: BORDER_RADIUS.f2,
  },
  pickerBox: {
    width: '100%',
    height: scrollItemHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    color: Theme.common.white,
  },
  textChooseBirthday: {
    textDecorationLine: 'underline',
  },
  textBirthday: {
    fontSize: '40@ms',
    fontWeight: 'bold',
  },
});

export default EditBasicInformation;
